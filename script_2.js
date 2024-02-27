function SenderMailMitsumori() {
  // シート「送付先一覧」より送付リストを取得
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("送付先一覧");
  var rows = sheet.getLastRow()-1;
  var columns = sheet.getLastColumn();
  var range = sheet.getRange(2,1,rows,columns);
  var datas = range.getValues();

  // シート「送信内容」よりメール情報を取得
  var templateSheet = ss.getSheetByName("送信内容");
  var subject = templateSheet.getRange("B1").getValue(); // 件名（B1セル）
  var bodyTemplate = templateSheet.getRange("B2").getValue(); // メール本文（B2セル）
  var signature = templateSheet.getRange("B3").getValue(); // 署名（B3セル）

  // 見積書が保存されているフォルダのIDを指定
  var folder = DriveApp.getFolderById("xxx"); 

  // Gmail作成
  datas.forEach(function(data) {
    var company = data[0]; // 会社名
    var name = data[1]; // 先方担当者
    var address = data[2]; // To
    var cc = data[3]; // Cc

    // フォルダより見積書を取得
    var files = folder.getFiles();
    var attachments = [];
    while (files.hasNext()) {
      var file = files.next();
      if (file.getName().includes(company)) {
        attachments.push(file.getAs(MimeType.PDF));
      }
    }

    // 宛先ごとにセット
    var body = bodyTemplate
                .replace(/{会社名}/g, company)
                .replace(/{担当者名}/g, name)
                + signature;

    // メールを下書きで保存
    GmailApp.createDraft(
      address, // 送信先アドレス
      subject, // 件名 
      body, // メール本文
      {
        cc: cc, // CCアドレス
        attachments: attachments  // 見積書の添付
      }
    );
  });
}