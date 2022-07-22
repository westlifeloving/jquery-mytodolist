// const task_list = [
//   { content: '写代码', complete: false },
//   { content: '看书', complete: false },
//   { content: '玩游戏', complete: true },
//   { content: '看电视', complete: false },
//   { content: '休息一会儿吧', complete: false },
//   { content: '继续学习', complete: false }
// ];

;(function () {
  'use strict';

  var $form_add_task = $('.add-task')
    , $task_delete_trigger
    , task_list = [
      { content: '写代码', complete: false },
      { content: '看书', complete: false },
      { content: '玩游戏', complete: true },
      { content: '看电视', complete: false },
      { content: '休息一会儿吧', complete: false },
      { content: '继续学习', complete: false }
    ]
    , $checkbox_complete
    ;

  var $form_search_task = $('.search-task');
  init();

  $form_add_task.on('submit', on_add_task_form_submit)
  function on_add_task_form_submit(e) {
    var new_task = {}, $input;
    /*禁用默认行为*/
    e.preventDefault();
    /*获取新Task的值*/
    $input = $(this).find('input[name=content]');
    new_task.content = $input.val();
    /*如果新Task的值为空 则直接返回 否则继续执行*/
    if (!new_task.content) return;
    /*存入新Task*/
    if (add_task(new_task)) {
      render_task_list();
      $input.val(null);
    }
  }
    //搜索待办事项
  $form_search_task.on('submit', form_search)
  function form_search(e) {
    var search_task = {}, $input;
    e.preventDefault();
    $input = $(this).find('input[name=filter]');
    search_task.content = $input.val();
    if (!search_task.content) return;
    console.log(task_list)
    console.log(search_task.content)
    // let newFind=task_list.filter(r=>         
    //   r.indexOf(search_task.content)!= -1
    // )
    // render_task_list(newFind);
  }

  /*监听完成Task事件*/
  function listen_checkbox_complete() {
    $checkbox_complete.on('click', function () {
      var $this = $(this);
      var index = $this.parent().parent().data('index');
      var item = get(index);
      if (item.complete)
        update_task(index, {complete: false});
      else
        update_task(index, {complete: true});
    })
  }

  function get(index) {
    return store.get('task_list')[index];
  }

  /*更新Task*/
  function update_task(index, data) {
    if (!index || !task_list[index])
      return;

    task_list[index] = $.extend({}, task_list[index], data);
    refresh_task_list();
  }

  /*查找并监听所有删除按钮的点击事件*/
  function listen_task_delete() {
    $task_delete_trigger.on('click', function () {
      var $this = $(this);
      /*找到删除按钮所在的task元素*/
      var $item = $this.parent().parent();
      var index = $item.data('index');
      delete_task(index);
    })
  }

  function add_task(new_task) {
    /*将新Task推入task_list*/
    task_list.push(new_task);
    /*更新localStorage*/
    refresh_task_list();
    return true;
  }

  // 刷新localStorage数据并渲染模板
  function refresh_task_list() {
    store.set('task_list', task_list);
    render_task_list();
  }

  /*删除一条Task*/
  function delete_task(index) {   
    /*如果没有index 或者index不存在则直接返回*/
    if (index === undefined || !task_list[index]) return;
    delete task_list[index];
    /*更新localStorage*/
    refresh_task_list();
  }

  function init() {
    task_list = store.get('task_list') || [];
    if (task_list.length)
      render_task_list();
  }

  // 渲染所有Task模板
  function render_task_list() {
    var $task_list = $('.task-list');
    $task_list.html('');
    var complete_items = [];
    for (var i = 0; i < task_list.length; i++) {
      var item = task_list[i];
      if (item && item.complete)
        complete_items[i] = item;
      else
        var $task = render_task_item(item, i);
      $task_list.prepend($task);
    }

    for (var j = 0; j < complete_items.length; j++) {
      $task = render_task_item(complete_items[j], j);
      if (!$task) continue;
      $task.addClass('completed');
      $task_list.append($task);
    }

    $task_delete_trigger = $('.action.delete')
    $checkbox_complete = $('.task-list .complete[type=checkbox]')
    listen_task_delete();
    listen_checkbox_complete();
  }

  // 渲染单条Task模板
  function render_task_item(data, index) {
    if (!data || !index) return;
    var list_item_tpl =
      '<div class="task-item" data-index="' + index + '">' +'  <label class="listitem">'+
      '<input class="complete" ' + (data.complete ? 'checked' : '') + ' type="checkbox">' +'<i>'+'</i>'+'</label>'+
      '<span class="task-content">' + data.content + '</span>' +
      '<span class="fr">' +
      '<span class="action delete"> ×</span>' +
      '</span>' +
      '</div>';
    return $(list_item_tpl);
  }
})();