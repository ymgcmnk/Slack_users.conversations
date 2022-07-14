 /**
 * シンプルトリガー　onOpen()
 * 
 * ＜プロジェクト概要＞
 * スプレッドシートを開いたときに自動的に以下を実行する
 * ・独自メニューをシートに追加する
 * ・スプレッドシートの最終行にセルを移動
 */
function onOpen() {
  // const ui = SpreadsheetApp.getUi();
  // ui.alert('★注意★\n\n現在、スクリプトを改修中です。改修終了まで、このシートの使用は控えてください。\nご協力お願いいたします。', ui.ButtonSet.OK);

  addMenu();
}

/**
 * ＜function概要＞
 * 独自メニューをシートに表示する　汎用性、使いまわしの観点から、base　class　が良いか。
 * https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet?hl=en#addmenuname,-submenus
 * https://developers.google.com/apps-script/reference/base/menu?hl=en
*/
function addMenu() {
  SpreadsheetApp.getUi()
    .createMenu('GAS')
    .addItem('最新情報の取得', 'setValuesOnSheet')
    // .addItem('02_My Menu Item', 'myFunction02')
    // .addItem('03_My Menu Item', 'myFunction03')
    // .addItem('04_My Menu Item', 'myFunction04')
    // .addSeparator()
    // .addItem('05_My Menu Item', 'myFunction05"')
    // .addItem('06_My Menu Item', 'myFunction06')
    // .addItem('07_My Menu Item', 'myFunction07')
//       .addSubMenu(SpreadsheetApp.getUi().createMenu('My Submenu')
//           .addItem('One Submenu Item', 'mySecondFunction')
//           .addItem('Another Submenu Item', 'myThirdFunction'))
    .addToUi();
}
