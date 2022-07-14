const USERID = "U*******"

/**
 * 新しいシートを作成して、そのシートに値をセットする関数。
 */
function setValuesOnSheet() {
  const today = Utilities.formatDate(new Date(), 'JST', 'YYYYMMdd_HH:mm:ss');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const newSheet = ss.insertSheet();
  newSheet.setName(USERID +"_"+ today);

  const values = convertObjectToArray();
  console.log(values);

  // sheet.getRange(1, 1, values.length, values[0].length).clear();
  // SpreadsheetApp.flush();
  newSheet.getRange(1, 1, values.length, values[0].length).setValues(values);
}


/**
 * SlackApiからconversations.listで得たレスポンスをJSONからオブジェクトにしたものを配列にする、スプレッドシートに書き込むために
 * @return {array} arrayChannelsInfo - SlackApiからconversations.listで得たレスポンスをJSONからオブジェクトにしたものを配列に格納
 * 
 * 参考
 * https://moripro.net/gas-object-to-array/
 */
function convertObjectToArray() {
  const objectOfSlackConversationsListResponse = getResponseAsObject();
  // console.log(objectOfSlackConversationsListResponse);
  // return;
  const arrayHasChannelObjects = objectOfSlackConversationsListResponse.channels;//OK;true取り除く
  const arrayChannelsInfo = arrayHasChannelObjects.map(channel => [channel.name, channel.id, channel.is_channel, channel.is_archived]);

  const headers = ["channel.name", "channel.id", "channel.is_channel", "channel.is_archived"];
   arrayChannelsInfo.unshift(headers)
  console.log(arrayChannelsInfo);
  // console.log(arrayChannelsInfo.length);
  // console.log(arrayChannelsInfo[0].length);
  return arrayChannelsInfo;
}

/**
 * SlackApiからconversations.listで得たレスポンスをJSONからオブジェクトにする関数
 * @return {object} objectOfSlackConversationsListResponse - conversations.listのレスポンスをオブジェクトにしたもの
 * 
 * 参考
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
 */
function getResponseAsObject() {
  const slackConversationsListResponse = getSlackConversationsList();
  const objectOfSlackConversationsListResponse = JSON.parse(slackConversationsListResponse);
  console.log(objectOfSlackConversationsListResponse);
  return objectOfSlackConversationsListResponse;
}

/**
 * Slackユーザが所属しているチャンネルの取得
 * 
 * NOTE:プロジェクトの設定＞スクリプト プロパティ　でslackBotUserOAuthToken　設定しておく。
 * 
 * 参考
 * https://evolite.hatenablog.com/entry/20200721/1595260840#:~:text=slack%E3%81%AE%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E5%85%A5%E5%8A%9B%E6%AC%84,%E8%A1%A8%E7%A4%BA%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B%E3%80%82
 * https://dev.classmethod.jp/articles/201909-describe-channels-and-usergroups-from-slack/
 */
function getSlackConversationsList() {
  const token = PropertiesService.getScriptProperties().getProperty('BotUserOAuthToken');
  const url = `https://www.slack.com/api/users.conversations`;

  const options =
  {
    method: "post",
    contentType: "application/x-www-form-urlencoded",
    headers: { "Authorization": `Bearer ${token}` },
    "payload": {
      "token": token,
      // "cursor": cursor,
      "exclude_archived": true,//ture =アーカイブされたチャンネルは除外する
      "limit": 1000,
      //  team_id: TEAMID,
      "types": "public_channel, private_channel, mpim, im",//チャンネルタイプの指定。mpim=multiparty IM（DMのこと。indirect Messageか）
      "user": USERID
    }
  }

  const rawResponse = UrlFetchApp.fetch(url, options);
  console.log(`rawResponse: ${rawResponse}`);
  // const objResponse =JSON.parse(rawResponse);
  // // console.log(`objResponse: ${objResponse}`);
  return rawResponse;
}