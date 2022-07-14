const USERID = "U0123456789"

/**
 * Function to create a new sheet and set values on it.
 * 新しいシートを作成して、そのシートに値をセットする関数。
 */
function setValuesOnSheet() {
  const today = Utilities.formatDate(new Date(), 'JST', 'YYYYMMdd_HH:mm:ss');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const newSheet = ss.insertSheet();
  newSheet.setName(USERID + "_" + today);

  const values = objectToArray();
  console.log(values);

  newSheet.getRange(1, 1, values.length, values[0].length).setValues(values);
}


/**
 * Function to convert a object to an array.(for set in a spreadsheet)
 * オブジェクトにしたものを配列にする(スプレッドシートに書き込むために)
 * @return {array} arrayChannelsInfo - チャンネル一覧が格納された配列
 * 
 * 参考
 * https://moripro.net/gas-object-to-array/
 */
function objectToArray() {
  const objectOfSlackConversationsListResponse = getResponseAsObject();
  const arrayHasChannelObjects = objectOfSlackConversationsListResponse.channels;//OK;true取り除く
  const arrayChannelsInfo = arrayHasChannelObjects.map(channel => [channel.name, channel.id, channel.is_channel, channel.is_archived]);

  const headers = ["channel.name", "channel.id", "channel.is_channel", "channel.is_archived"];
  arrayChannelsInfo.unshift(headers)
  console.log(arrayChannelsInfo);
  return arrayChannelsInfo;
}


/**
 * Function to convert the response obtained by users.conversations from JSON to object
 * users.conversationsで得たレスポンスをJSONからオブジェクトにする関数
 * @return {object} objectOfSlackConversationsListResponse - users.conversationsのレスポンスをオブジェクトにしたもの
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
 * List conversations the calling user may access.
 * アクセスできる会話を一覧表示します。プライベートやDMグループは、その中にBotが入っていないと取得できない。
 * 
 * @return {JSON} - rawResponse
 * NOTE: Need setting script property"BotUserOAuthToken"
 * SEE: https://api.slack.com/methods/users.conversations
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
      "token": token,//Required arguments
      // "cursor": cursor, //Optional arguments
      "exclude_archived": true,//ture =アーカイブされたチャンネルは除外する　//Optional arguments
      "limit": 1000, //Optional arguments
      //  team_id: TEAMID, //Optional arguments
      "types": "public_channel, private_channel, mpim, im",//チャンネルタイプの指定。mpim=multiparty IM（DMのこと。indirect Messageか）
      "user": USERID //Optional arguments
    }
  }

  const rawResponse = UrlFetchApp.fetch(url, options);
  console.log(`rawResponse: ${rawResponse}`);
  return rawResponse;
}