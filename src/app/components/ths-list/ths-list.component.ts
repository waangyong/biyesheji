import { Component, EventEmitter, Input, KeyValueDiffers, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-ths-list',
  templateUrl: './ths-list.component.html',
  styleUrls: [ './ths-list.component.scss' ],
})
export class ThsListComponent implements OnInit {
  /**
   * 上拉加载更多的滚动
   */
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  public dataList: Array<object>;
  public desMapper: Array<string>;

  /**
   * 列表数据
   * @param items 对象的数组
   */
  @Input()
  data: Array<object>;
  /**
   *  要在首行显示的字段名
   */
  @Input()
  titleField: string;

  /**
   * 字段别名（用于在列表中显示中文的描述名称，如：姓名：XXX 中的 姓名，同时有排序的功能）
   * @param fields 传入的字段
   */
  @Input()
  aliasFields: object;

  /**
   *   显示中文描述,默认显示
   */
  @Input()
  showAlias: string;

  /**
   *  左侧显示的图标
   */
  @Input()
  icon: string;

  /**
   *  左侧显示的图标不固定，根据每项的数据来却确定
   */
  @Input()
  iconField: string;

  /**
   *  detail:行尾显示箭头，默认为detail todo:favorite or other image?
   */
  @Input()
  type: 'detail' | 'favorite' | null = 'detail';

  /**
   *  点击弹出的详情页地址
   */
  @Input()
  detailUrl: string;

  /**
   *  single 一行显示一个 double 一行显示两个，默认为single
   */
  @Input()
  desType: 'single' | 'double' | null = 'single';

  /**
   *  每项的点击事件
   */
  @Output()
  itemClick = new EventEmitter<object>();

  /**
   *  下拉刷新的事件
   */
  @Output()
  update = new EventEmitter<object>();

  /**
   *  上拉加载更多的事件
   */
  @Output()
  loadMore = new EventEmitter<object>();

  private differ: any;

  constructor(private router: Router, private differs: KeyValueDiffers) {
    this.differ = differs.find([]).create();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngDoCheck() {
    if (this.differ.diff(this.data)) {
      this.dataList = (this.data || []).map((item) => {
        if (this.aliasFields) {
          const mapped = Object.keys(item).map(key => {
            const newKey = this.aliasFields[key] || key;
            return { [newKey]: item[key] };
          });
          return Object.assign({}, ...mapped);
        } else {
          return item;
        }
      });
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes) {
    if (changes.aliasFields) {
      this.desMapper = Object.keys(this.aliasFields || {}).map(key => this.aliasFields[key]);
    }
  }

  /**
   *  下拉刷新
   * @param event 下拉刷新的事件
   */
  updateData(event) {
    this.infiniteScroll.disabled = false;
    this.update.emit(event);
  }

  /**
   * 上拉加载
   * @param event 上拉加载更多
   */
  loadMoreData(event) {
    this.loadMore.emit(event);
  }

  /**
   *  跳转到详情页
   */
  openDetail(item: object) {
    if (this.detailUrl) {
      this.router.navigate([ this.detailUrl ], { queryParams: item });
    }
    this.itemClick.emit(item);
  }

  ngOnInit(): void {
  }

}
