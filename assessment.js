'use strict';  // 宣言後の記述ミスをエラーとして表示してくれる機能を呼び出す
// HTML上のIDから要素を取得
const userNameInput = document.getElementById('user-name');
const assessmentButton = document.getElementById('assessment');
const resultDivided = document.getElementById('result-area');
const tweetDivided = document.getElementById('tweet-area');

/**
 * 指定した要素の子どもを全て削除する
 * @param {HTMLElement} element  HTMLの要素
 */
function removeAllChild(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

userNameInput.onkeydown = event => {  // event => {} は  function(event) {}と同じ
    if(event.key === 'Enter') {  // event.key で押したキーを取得できる
        assessmentButton.onclick();        
    }
}

// 無名関数(アロー関数）：ファンクション名がない関数のこと（function() {} は () =>と同じ）
assessmentButton.onclick = () => {　　// assessmentButtonのプロパティとして、onclickを使用. onClickに関数を代入してボタンが押された際に関数が起動するようにしている
    const userName = userNameInput.value;  // inputされた値に対してvalueプロパティを設定
    if (userName.length == 0) {
        return;  // 名前が空の時は処理を終了する（終了条件から書くのが味噌）
    }

    // 診断結果表示エリアの作成
    removeAllChild(resultDivided);  //現在は二つ子要素があるので、二回繰り返す
    const header = document.createElement('h3');  // h3タグを作成
    header.innerText = '診断結果';  // h3タグ内に診断結果と書き込む
    resultDivided.appendChild(header);  // id resultDivided<divタグ>内にh3を書き込む

    const paragraph = document.createElement('p');
    const result = assessment(userName);
    paragraph.innerText = result;
    resultDivided.appendChild(paragraph);

    // TODO ツイートエリアの作成
    removeAllChild(tweetDivided);
    const anchor = document.createElement('a');
    const hrefValue = 
    'https://twitter.com/intent/tweet?button_hashtag=' +   // URIの?以降はクエリというが、このクエリに半角英数字が入ってる場合はエンコードしないといけない（encodeURLComponent()）
    encodeURIComponent('あなたのいいところ') + 
    '&ref_src=twsrc%5Etfw';
    anchor.setAttribute('href', hrefValue);  // setAttribute()関数は第一引数に属性を指定、第二引数にセットしたい値を入力する
    anchor.className = 'twitter-hashtag-button';
    anchor.setAttribute('data-text', result);
    anchor.innerText = 'Tweet #あなたのいいところ';
    tweetDivided.appendChild(anchor);

    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    tweetDivided.appendChild(script);
}

/* var と const/let の使い分けについて
* ①スコープによる違い
*   --- varはスコープなし
*   --- constとletはブロックスコープ
*
* ②値の再代入不可の違い
*   --- constは値の再代入が不可（スコープ内においても再代入不可となっている）
*   --- letは値の再代入は可能
*/
const answers = [
    '{userName}のいいところは声です。{userName}の特徴的な声は皆を惹きつけ、心に残ります。',
    '{userName}のいいところはまなざしです。{userName}に見つめられた人は、気になって仕方がないでしょう。',
    '{userName}のいいところは情熱です。{userName}の情熱に周りの人は感化されます。',
    '{userName}のいいところは厳しさです。{userName}の厳しさがものごとをいつも成功に導きます。',
    '{userName}のいいところは知識です。博識な{userName}を多くの人が頼りにしています。',
    '{userName}のいいところはユニークさです。{userName}だけのその特徴が皆を楽しくさせます。',
    '{userName}のいいところは用心深さです。{userName}の洞察に、多くの人が助けられます。',
    '{userName}のいいところは見た目です。内側から溢れ出る{userName}の良さに皆が気を惹かれます。',
    '{userName}のいいところは決断力です。{userName}がする決断にいつも助けられる人がいます。',
    '{userName}のいいところは思いやりです。{userName}に気をかけてもらった多くの人が感謝しています。',
    '{userName}のいいところは感受性です。{userName}が感じたことに皆が共感し、わかりあうことができます。',
    '{userName}のいいところは節度です。強引すぎない{userName}の考えに皆が感謝しています。',
    '{userName}のいいところは好奇心です。新しいことに向かっていく{userName}の心構えが多くの人に魅力的に映ります。',
    '{userName}のいいところは気配りです。{userName}の配慮が多くの人を救っています。',
    '{userName}のいいところはその全てです。ありのままの{userName}自身がいいところなのです。',
    '{userName}のいいところは自制心です。やばいと思ったときにしっかりと衝動を抑えられる{userName}が皆から評価されています。'
    '{userName}のいいところは優しさです。{userNam}の優しい雰囲気や立ち振る舞いに多くの人が癒されています。'
];

// 以下JSDoc形式でコメントを書く（関数の処理 / 関数が受ける入力<引数> / 関数が出力するもの<return>　の3種類を書く）
/**
 * 名前の文字列を渡すと診断結果を返す関数
 * @param {string} userName  ユーザーの名前
 * @return (string) 診断結果
 */
function assessment(userName) {
    // 全文字のコード番号を取得してそれを足し合わせる
    let sumOfCharCode = 0;  // letはこのfunction内でのみ有効
    for (let i = 0; i < userName.length; i++) {  // letはこのfor文内でのみ有効
        sumOfCharCode = sumOfCharCode + userName.charCodeAt(i);  // charCodeAt()関数は文字列を配列と勝手にみなし、与えられた引数に該当する文字の文字コードを返す
    }

    // 文字のコード番号の合計を回答の数（const answers で用意した出力する回答例のこと）で割って添字の数値を求める
    const index = sumOfCharCode % answers.length;
    let result = answers[index];
    result = result.replace(/{userName}/g, userName);
    return result;
}

// console.assert()を用いてテストを行う（console.assert(呼び出したい関数(第一引数：trueの場合の出力, 第二引数：falseの場合の出力))
console.assert(
    assessment('太郎') ===
    '太郎のいいところは決断力です。太郎がする決断にいつも助けられる人がいます。',  // 処理が正しく行われている場合はコンソール上での表示はない
    '診断結果の文言の特定部分を名前に置き換える処理が正しくありません。'
);

// テストコード
console.assert(
    assessment('太郎') === assessment('太郎'),
    '太郎のいいところは決断力です。太郎がする決断にいつも助けられる人がいます。',
    '同じ名前が入力された際に違う診断結果を出力しています。確認してください。'
)

