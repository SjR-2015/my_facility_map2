# 汎用施設マップ

さまざまな施設を地図上にマッピングして、みんなに広めよう！

![image-20241208080751941](https://github.com/user-attachments/assets/840bf857-4fff-49d0-9faa-2a0fc6780300)

### ディレクトリ構成

```
my_facility_map/
│
├── index.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js
│   └── index.js
│
├── data/
│   ├── facilities.json
│   ├── facility_types.json
│   └── attribute_definitions.json
│
└── images/
│
│
└── doc/
    └── 汎用施設マップ.pdf
```

### 説明

`index.html`: メインのHTMLファイル

`css/`: スタイルシートファイルを格納するディレクトリ

- `styles.css`: スタイルシートファイル

`js/`: JavaScriptファイルを格納するディレクトリ

- `app.js`: 地図の初期化および機能を実装するJavaScriptファイル
- `index.js`: 初期座標とBing Maps APIキーを設定するJavaScriptファイル

`data/`: JSONデータファイルを格納するディレクトリ

- `facilities.json`: 施設情報を含むJSONファイル
- `facility_types.json`: 施設分類情報を含むJSONファイル
- `attribute_definitions.json`: 属性定義を含むJSONファイル

`images/`: 画像ファイルを格納するディレクトリ（未使用）

`doc/`: 汎用施設マップに関するドキュメントを格納するディレクトリ

- `汎用施設マップ.pdf`: 汎用施設マップコードの説明



### dataについて

汎用性を持たせるために、少しだけdata構造が複雑ですが、データの関連性を示しますのでこの関連性がわかれば、様々な用途で使用できるようになります

#### データの関連性について


![image-20241208085444056](https://github.com/user-attachments/assets/d91326a1-d66a-4373-8bc0-52effc0cd609)


![image-20241208092321706](https://github.com/user-attachments/assets/061bbaad-d2b1-4df5-8528-36661e3f6339)



#### data\facilities.json：こちらに施設情報を記載します

```
{
    "facilities": [
        {
            "facility_id": 1,
            "facility_type_id": 1,
            "facility_name": "サンプル施設１",
            "address": "小山市",
            "latitude": 36.2983, 
            "longitude": 139.7872,
            "reserve1": "03-1234-5678",
            "reserve2": "http://example.com",
            "reserve3": "",
            "reserve4": "",
            "reserve5": "",
            "reserve6": "",
            "reserve7": "",
            "reserve8": "",
            "reserve9": "",
            "reserve10": ""
        },
・・・省略
```

| キー             | 内容               | 備考                                                         |
| ---------------- | ------------------ | ------------------------------------------------------------ |
| facility_id      | シーケンシャル番号 | 未使用                                                       |
| facility_type_id | 施設分類ID         | facility_types.jsonに従い関連付けしてください                |
| facility_name    | 施設名             |                                                              |
| address          | 施設住所           |                                                              |
| latitude         | 緯度               | 地図マッピングには必須                                       |
| longitude        | 経度               | 地図マッピングには必須                                       |
| reserve1..10     | 予備1～10          | attribute_definitions.jsonで属性を定義し、その属性の情報を記入ください |



#### data/facility_types.json：こちらに施設分類を記載します

```
{
    "facility_types": [
        {
            "facility_type_id": 1,
            "facility_type_name": "施設１",
            "color": "#FF5733"  
        },
        {
            "facility_type_id": 2,
            "facility_type_name": "施設２",
            "color": "#33C3FF"  
        }
    ]
}
```

| キー               | 内容         | 備考                                                 |
| ------------------ | ------------ | ---------------------------------------------------- |
| facility_type_id   | 施設分類ID   | facilities.jsonのfacility_type_idと関連付けされます  |
| facility_type_name | 施設分類名   | facility_type_idの施設分類名で、地図上に表示されます |
| color              | 施設分類の色 | 地図上の施設指定ボタンの色として使われます           |



#### data/attribute_definitions.json：予備1～10の属性情報

```
{
    "attribute_definitions": [
        {
            "attribute_id": 1,
            "reserve_name": "電話番号"
        },
        {
            "attribute_id": 2,
            "reserve_name": "URL"
        }
    ]
}
```

| キー         | 内容            | 備考                                     |
| ------------ | --------------- | ---------------------------------------- |
| attribute_id | reserveの番号   | reserve1～10の何番かを指定します         |
| reserve_name | reserveの属性名 | 施設情報を表示したときの項目名になります |



## 変更方法

`data/`の変更によってマップは構築されますが、Webページ名、表示地図の位置の変更方法を示します

#### webページ名の変更

変更コード：`index.html`

```
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>汎用施設マップ</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div id="header">
        <h1>汎用施設マップ</h1>
        <div id="facility-buttons"></div>
    </div>
    <div id="map"></div>
    <div id="facility-info"></div>
    <script src="js/index.js"></script>
    <script src="https://www.bing.com/api/maps/mapcontrol?key=AhGQykUKW2-u1PwVjLwQkSA_1rCTFESEC7bCZ0MBrnzVbVy7KBHsmLgwW_iRJg17"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

以下の個所を修正してください

```
<title>汎用施設マップ</title>
```

```
<h1>汎用施設マップ</h1>
```



#### 表示地図の位置の変更

変更コード：`js\index.js`

```
const initialCoordinates = [36.3134859, 139.8064811]; // 小山市の初期表示座標
const initialZoomLevel = 14;

// Bing Maps APIキー
const bingApiKey = 'AhGQykUKW2-u1PwVjLwQkSA_1rCTFESEC7bCZ0MBrnzVbVy7KBHsmLgwW_iRJg17';
```

以下の個所を修正してください

```
const initialCoordinates = [36.3134859, 139.8064811];
```

地図のスケールの初期値を変えることで地図表示範囲が変わりますので、必要に応じて調整ください

```
const initialZoomLevel = 14;
```

