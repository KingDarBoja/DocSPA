import { Component, Input, OnInit, ViewEncapsulation, HostBinding, SimpleChanges } from '@angular/core';

import { of } from 'rxjs';
import { flatMap, map, share } from 'rxjs/operators';
import unified from 'unified';
import markdown from 'remark-parse';
import toc from 'mdast-util-toc';
import visit from 'unist-util-visit';
import slug from 'remark-slug';
import rehypeStringify from 'rehype-stringify';
import remark2rehype from 'remark-rehype';
import raw from 'rehype-raw';

import { join } from '../../utils';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { FetchService } from '../../services/fetch.service';
import { RouterService } from '../../services/router.service';
import { LocationService } from '../../services/location.service';

import { links, images } from '../../plugins/links';
import frontmatter from 'remark-frontmatter';
import MDAST from 'mdast';

@Component({
  selector: 'md-toc', // tslint:disable-line
  template: ``,
  encapsulation: ViewEncapsulation.None
})
export class TOCComponent implements OnInit {
  static readonly is = 'md-toc';

  @Input()
  set path(val: string) {
    if (val !== this._path) {
      this._path = val;
      this.load(this.path);
    }
  }
  get path() {
    return this._path;
  }

  @Input()
  minDepth = 1;

  @Input()
  public maxDepth = 6;

  @Input()
  public tight = false;

  @HostBinding('innerHTML')
  html: SafeHtml;

  private processor: any;
  private _path: string;

  constructor(
    private fetchService: FetchService,
    private routerService: RouterService,
    private locationService: LocationService,
    private sanitizer: DomSanitizer,
  ) {
    const toToc = () => {
      return (tree: MDAST.Root) => {
        const result = toc(tree, { maxDepth: this.maxDepth, tight: this.tight });
        tree.children = [].concat(
          tree.children.slice(0, result.index),
          result.map || []
        );
        return tree;
      };
    };

    const removeMinNodes = () => {
      return (tree: MDAST.Root) => {
        return visit(tree, 'heading', (node: MDAST.Heading, index: number, parent: any) => {
          if (node.depth < this.minDepth) {
            parent.children.splice(index, 1);
          }
          return true;
        });
      };
    };

    this.processor = unified()
      .use(markdown)
      .use(frontmatter)
      .use(slug)
      .use(removeMinNodes)
      .use(toToc)
      .use(links, locationService)
      .use(images, locationService)
      .use(remark2rehype, { allowDangerousHTML: true })
      .use(raw)
      .use(rehypeStringify);
  }

  ngOnInit() {
    if (!this.path) {
      this.path = this.routerService.contentPage;
      this.routerService.changed.subscribe((changes: SimpleChanges) => {
        if ('contentPage' in changes) {
          this.path = changes.contentPage.currentValue;
        }
      });
    } else {
      this.load(this.path);
    }
  }

  private load(page: string) {
    if (typeof page !== 'string' || page.trim() === '') {
      return of(null);
    }

    const vfile = this.locationService.pageToFile(page);
    const fullpath = join(vfile.cwd, vfile.path);
    this.fetchService.get(fullpath)
      .pipe(
        flatMap(resource => {
          vfile.contents = resource.contents;
          vfile.data = vfile.data || {};

          // TODO: might need to run plugins if headers change
          return resource.notFound ? of('') : this.processor.process(vfile);
        }),
        map(String),
        share()
      ).subscribe(_ => {
        this.html = this.sanitizer.bypassSecurityTrustHtml(_);
      });
  }
}
