"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { flushSync } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { isPartnerHost } from "@/lib/isPartnerHost";
import QAChatWidget from "@/components/QAChatWidget";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const G_PREMIUM = "linear-gradient(135deg, #c026d3, #9333ea)";
const G_NAVY = "linear-gradient(135deg, #3b5a82, #1f3a5f)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const YOUR_CHANGE_TYPES: { category: string; title: string; insight: string; hidden1: string; hidden2: string }[] = [
    { category: "?뮥 ??, title: "?덉? 踰뚯?留??먯궛? ???섏뼱??, insight: "?붽툒???섏걯吏 ?딄퀬 ?ъ뾽??援대윭媛?붾뜲\n留됱긽 ?듭옣??蹂대㈃ 紐⑥씤 寃??놁뼱??, hidden1: "?뱀떊?먭쾶 遺議깊븳 嫄?踰꾨뒗 ?λ젰???꾨땲?먯슂\n踰꾨뒗 ?덉쓣 '癒몃Т瑜닿쾶' ?섎뒗 諛⑸쾿??紐⑤Ⅴ怨??덉쓣 肉먯씠?먯슂\n洹?諛⑸쾿 ?섎굹留??뚮㈃ ?먮쫫???듭㎏濡?諛붾앸땲??, hidden2: "3?붿뿉 ?ㅼ뼱?ㅻ뒗 ?묒? 遺?섏엯 ?섎굹瑜?洹몃?濡??⑤쾭由ъ? ?딄퀬\n?먮룞?댁껜濡??곕줈 ?쇱뼱 紐⑥쑝湲??쒖옉?섎㈃\n9?붿캈??洹??덉씠 ??諛?媛源뚯씠 遺덉뼱???덉쓣 ?뺣쪧???믪뒿?덈떎\n吏湲덈????묒? ?듦???留뚮뱾?대몢??寃껋씠 洹??먮쫫???쒕?濡?諛쏅뒗 ?듭떖?낅땲??" },
    { category: "?뮥 ??, title: "?곕룉? ?ㅼ뼱?ㅻ뒗???먭씀 ?щ씪吏?, insight: "蹂대꼫?ㅻ뱺 怨꾩빟湲덉씠????踰덉뵫 ?ш쾶 ?ㅼ뼱?ㅻ뒗??n?댁긽?섍쾶 洹?吏곹썑??瑗???吏異쒖씠 ?곕씪???, hidden1: "洹멸굔 ?곗뿰???꾨땲???뱀떊 ?ъ＜???덇꺼吏??먮쫫?댁뿉??n?덉씠 ?ㅼ뼱?ㅻ뒗 ??대컢怨??섍?????대컢??臾띠뿬?덉뼱??洹몃옒??n???먮쫫????踰??딆쑝硫?洹??ㅼ쓬遺?곕뒗 ?볦씠湲??쒖옉?댁슂", hidden2: "7?붿뿉 ?덉긽蹂대떎 ???덉씠 ?ㅼ뼱?ㅻ뒗??n?ㅼ뼱??利됱떆 ?덈컲???ㅻⅨ 怨꾩쥖濡???꺼?먮㈃\n?곕쭚????吏異쒖씠 ?앷꺼??臾대꼫吏吏 ?딄퀬 踰꾪떥 ?뺣쪧???믪뒿?덈떎\n吏湲덈????묒? ?듦???留뚮뱾?대몢??寃껋씠 洹??먮쫫???쒕?濡?諛쏅뒗 ?듭떖?낅땲??" },
    { category: "?뮥 ??, title: "?쇱쓣 留롮씠 ?대룄 媛?쒗븳 ?먮굦", insight: "?⑤뱾 蹂닿린??諛붿걯怨??댁떖???щ뒗??n?뺤옉 留덉쓬 ?쒓뎄?앹뿏 ??긽 履쇰뱾由щ뒗 ?먮굦???덉뼱??, hidden1: "?뱀떊??踰뚯씠 ?먯껜???됯퇏 ?댁긽?댁뿉??n臾몄젣??'?섎뒗 遺議깊븯????誘우쓬??吏異쒖쓣 ?먭씀 留뚮뱾?대궦?ㅻ뒗 嫄곗삁??n洹?誘우쓬??肉뚮━瑜??뚮㈃ ???닿? ?먯뿰?ㅻ읇寃?諛붾앸땲??, hidden2: "4?붿뿉 媛怨꾨?瑜????щ쭔 ?쒕?濡??곸뼱蹂대㈃\n?앷컖蹂대떎 ?덈뒗 ?덉쓽 ?덈컲??異⑸룞?곸씤 ?뚮퉬?쇰뒗 嫄??뚭쾶 ?섍퀬\n洹멸구 留됰뒗 ?쒓컙遺???띿슂濡쒖???泥닿컧?섍쾶 ???뺣쪧???믪뒿?덈떎\n吏湲덈????묒? ?듦???留뚮뱾?대몢??寃껋씠 洹??먮쫫???쒕?濡?諛쏅뒗 ?듭떖?낅땲??" },
    { category: "?뮆 ?좎젙", title: "吏앹쓣 紐?留뚮굹怨??덉쓬", insight: "二쇰?? ??吏앹씠 ?덈뒗??n?섎쭔 ?먭씀 ?쇱옄??寃?媛숈븘???몃줈?뚯슂", hidden1: "?뱀떊???몄뿰???녿뒗 ?щ엺?대씪?쒓? ?꾨땲?먯슂\n吏湲덇퉴吏???몄뿰???ㅼ뼱???쒓린媛 ?꾨땲?덉쓣 肉먯씠?먯슂\n洹?臾몄씠 怨??대━???먮쫫???ъ＜??蹂댁엯?덈떎", hidden2: "5?붿뿉 吏?몄씠 ?〓뒗 紐⑥엫?대굹 ?뚭컻 ?먮━????踰??섍?寃??섎뒗??n?됱냼?쇰㈃ 嫄곗젅?덉쓣 洹??먮━??媛蹂대㈃\n洹??щ엺怨?媛?꾧퉴吏 ?댁뼱吏???몄뿰???쒖옉???뺣쪧???믪뒿?덈떎\n留덉쓬???뺤쭅?섍쾶 ?쒗쁽?섎뒗 寃껋씠 洹??먮쫫??媛???ш쾶 ?ㅼ슦??諛⑸쾿?낅땲??" },
    { category: "?뮆 ?좎젙", title: "留뚮굹???щ엺留덈떎 ?ㅼ뼱吏?, insight: "?쒖옉???뚮뒗 遺꾨챸 ?ㅻ젅怨?醫뗭븯?붾뜲\n?댁긽?섍쾶 ??긽 鍮꾩듂??吏?먯뿉???앹씠 ?섏슂", hidden1: "?ㅼ뼱吏먯씠 諛섎났??嫄??뱀떊 ?볦씠 ?꾨땲?먯슂\n吏湲덇퉴吏 留뚮궃 ?щ엺?ㅼ씠 ?뱀떊 ?ъ＜? 留욌Ъ由щ뒗 諛⑺뼢???꾨땲?덉쓣 肉먯씠?먯슂\n留욌뒗 諛⑺뼢???뚮㈃ ?대쾲???ㅻⅤ寃??섎윭媛묐땲??, hidden2: "8?붿캈??鍮꾩듂???⑦꽩????蹂댁씠???щ엺??留뚮굹寃??섎뒗??n洹몃븣 ?덉쟾泥섎읆 留욎떠二쇨린留??섏? ?딄퀬 ?붿쭅?섍쾶 留먯쓣 爰쇰궡硫?n?대쾲??媛숈? 吏?먯뿉???앸굹吏 ?딄퀬 ?ㅻ옒 媛??뺣쪧???믪뒿?덈떎\n留덉쓬???뺤쭅?섍쾶 ?쒗쁽?섎뒗 寃껋씠 洹??먮쫫??媛???ш쾶 ?ㅼ슦??諛⑸쾿?낅땲??" },
    { category: "?렞 ?깃났", title: "?댁떖???대룄 ?몄젙諛쏆? 紐삵븿", insight: "遺꾨챸 ?⑤뱾蹂대떎 ??留롮씠 ?몃젰?섎뒗??n洹멸쾶 ????蹂댁씠??寃?媛숈븘 ?듬떟?댁슂", hidden1: "?뱀떊???ㅻ젰? ?대? ?몄젙諛쏆쓣 ?섏????섏뿀?댁슂\n?ㅻ쭔 洹멸쾶 ?쒕윭??臾대?媛 ?꾩쭅 ?대━吏 ?딆븯??肉먯씠?먯슂\n洹?臾대?媛 癒몄??딆븘 ?뱀떊 ?욎뿉 ?쇱퀜吏묐땲??, hidden2: "6?붿뿉 ?됱냼?????섏꽌??諛쒗몴??蹂닿퀬 ?먮━媛 ??踰??앷린?붾뜲\n洹?湲고쉶瑜??쇳븯吏 ?딄퀬 吏곸젒 ?섏꽌??留≪쑝硫?n洹멸구 蹂??듭떖 ?몃Ъ?먭쾶 ?쒕?濡?媛곸씤???뺣쪧???믪뒿?덈떎\n吏湲덉쓽 ?묒? ?좏깮??洹??쒓린瑜?寃곗젙吏볥뒗 媛??以묒슂???붿냼?낅땲??" },
    { category: "?렞 ?깃났", title: "轅덉? ?ъ?留??쒖옉 ?⑷린媛 ?놁쓬", insight: "癒몃┸?띿뿏 醫뗭? 怨꾪쉷??媛?앺븳??n留됱긽 泥ル컻???쇰젮硫?留앹꽕?ъ졇??, hidden1: "洹?怨꾪쉷? 異⑸텇???꾩떎???덈뒗 怨꾪쉷?댁뿉??n?ㅻ쭔 ?먮젮????ㅼ젣 ?꾪뿕蹂대떎 ?⑥뵮 ?ш쾶 ?먭뺨吏怨??덉쓣 肉먯씠?먯슂\n洹??먮젮????ш린???쒖옉怨??④퍡 以꾩뼱??땲??, hidden2: "4???덉뿉 媛???묒? ?⑥쐞濡???媛吏留??쒖옉?대낫硫?n?앷컖蹂대떎 諛섏쓳??鍮좊Ⅴ寃??곕씪?ㅺ퀬\n洹??먮쫫???怨??곕쭚源뚯? 怨꾪쉷???ㅼ썙?섍컝 ?뺣쪧???믪뒿?덈떎\n吏湲덉쓽 ?묒? ?좏깮??洹??쒓린瑜?寃곗젙吏볥뒗 媛??以묒슂???붿냼?낅땲??" },
    { category: "?뮳 ?ъ뾽", title: "?ъ뾽 ?꾩씠?붿뼱??留롮????ㅽ뻾 紐삵븿", insight: "愿쒖갖? ?꾩씠?붿뼱媛 怨꾩냽 ?좎삤瑜대뒗??n?ㅽ뻾?쇰줈 ??만 ?먯떊???????앷꺼??, hidden1: "?꾩씠?붿뼱 ?먯껜???대? 異⑸텇??愿쒖갖? ?섏??댁뿉??n吏湲덇퉴吏???ㅽ뻾?섍린??留욌뒗 ?ш굔???꾨땲?덉쓣 肉먯씠?먯슂\n吏湲덉씠 諛붾줈 洹??ш굔??媛뽰떠吏???쒖젏?낅땲??, hidden2: "5?붿뿉 洹몃룞???좎삱由??꾩씠?붿뼱 以??섎굹瑜?n?묒? 洹쒕え濡??쒕쾾 ?댁쁺?대낫硫?n?덉긽蹂대떎 鍮좊Ⅴ寃?泥?留ㅼ텧???≫? ?먯떊媛먯씠 遺숈쓣 ?뺣쪧???믪뒿?덈떎\n?レ옄? ?щ엺 愿由щ? ?숈떆??梨숆린??寃껋씠 洹??먮쫫??吏?ㅻ뒗 鍮꾧껐?낅땲??" },
    { category: "?뮳 ?ъ뾽", title: "?ъ뾽?대뇬?붾뜲 留앺븿", insight: "??踰??쒖옉?덈떎媛 ?ㅽ뙣??寃쏀뿕???덉뼱??n?ㅼ떆 ?쒕룄???먯떊媛먯씠 ?????앷꺼??, hidden1: "洹??ㅽ뙣???뱀떊???λ젰 遺議깆씠 ?꾨땲?덉뼱??n?쒖젏怨?議곌굔??洹몃븣??留욎? ?딆븯??肉먯씠?먯슂\n?대쾲??洹?議곌굔???뱀떊?먭쾶 ?좊━?섍쾶 諛붾앸땲??, hidden2: "9?붿캈???덉쟾怨?鍮꾩듂??湲고쉶媛 ?ㅼ떆 李얠븘?ㅻ뒗??n洹몃븣 ?먭툑 愿由щ쭔 誘몃━ ?곕줈 ?뺥빐?먭퀬 ?쒖옉?섎㈃\n?대쾲??吏?쒕쾲怨??ㅻⅤ寃??덉젙?곸쑝濡??먮━?≪쓣 ?뺣쪧???믪뒿?덈떎\n?レ옄? ?щ엺 愿由щ? ?숈떆??梨숆린??寃껋씠 洹??먮쫫??吏?ㅻ뒗 鍮꾧껐?낅땲??" },
    { category: "?뭾 寃고샎", title: "寃고샎?섍퀬 ?띠????곷?媛 ?놁쓬", insight: "寃고샎? ?섍퀬 ?띠???n?곗븷 ?먯껜媛 ???쒖옉?섏? ?딆븘???듬떟?댁슂", hidden1: "?뱀떊? 寃고샎??以鍮꾧? ?대? 異⑸텇???섏뼱 ?덈뒗 ?щ엺?댁뿉??n吏湲?鍮꾩뼱?덈뒗 嫄??щ엺 ??紐낅퓧?댁뿉??n洹??щ엺???ㅼ뼱?ㅻ뒗 ?먮쫫??癒몄??딆븘 ?쒖옉?⑸땲??, hidden2: "10?붿뿉 吏??寃고샎?앹씠??紐⑥엫 ?먮━?먯꽌\n?됱냼? ?ㅻⅤ寃??곴레?곸쑝濡???붾? ?댁뼱媛硫?n洹??먮━?먯꽌 留뚮궃 ?щ엺怨??대뀈 遊꾧퉴吏 ?댁뼱吏??뺣쪧???믪뒿?덈떎\n?쒕줈???띾룄瑜?議댁쨷?섎뒗 留덉쓬??洹??쒓린瑜?媛???덉쟾?섍쾶 留뚮벊?덈떎." },
    { category: "?룫 吏곸옣", title: "?댁떖???쇳빐???뱀쭊??????, insight: "?깃낵??遺꾨챸???덈떎怨??앷컖?섎뒗??n?먮━????洹몃?濡쒖씤 寃?媛숈븘??, hidden1: "?뱀떊???ㅻ젰? ?대? 洹??먮━瑜??섏뼱???섏??댁뿉??n?ㅻ쭔 洹??ㅻ젰???쒕윭??臾대?媛 ?꾩쭅 ?ㅼ? ?딆븯??肉먯씠?먯슂\n洹?臾대?媛 怨??뱀떊 ?욎뿉 ?대┰?덈떎", hidden2: "7???몄궗 ?쒖쫵 ?꾩뿉 洹몃룞?덉쓽 ?깃낵瑜?n?レ옄? 湲곕줉?쇰줈 ?뺣━?댁꽌 癒쇱? 蹂닿퀬?섎㈃\n洹??먮즺媛 寃곗젙?곸씤 ???쒓? ?섏뼱 ?뱀쭊???뺣쪧???믪뒿?덈떎\n袁몄???蹂댁뿬二쇰뒗 紐⑥뒿??洹??쒓린瑜??욌떦湲곕뒗 媛???뺤떎??諛⑸쾿?낅땲??" },
    { category: "?룫 吏곸옣", title: "?댁쭅??怨좊?留??섍퀬 ?덉쓬", insight: "吏湲??먮━媛 ?듬떟??嫄?留욌뒗??n留됱긽 ??린?ㅻ땲 ?⑷린媛 ?????섏슂", hidden1: "洹??듬떟?⑥? ?뱀떊???쏀빐?쒓? ?꾨땲?먯슂\n吏湲??먮━媛 ?뱀떊??洹몃쫯??鍮꾪빐 ?묒쓣 肉먯씠?먯슂\n??留욌뒗 ?먮━媛 ?대? ?뱀떊 履쎌쑝濡??吏곸씠怨??덉뼱??, hidden2: "6?붿뿉 ?앷컖吏??紐삵븳 怨녹뿉???댁쭅 ?쒖븞???섎굹 ?ㅼ뼱?ㅻ뒗??n議곌굔留?蹂닿퀬 嫄곗젅?섏? ?딄퀬 ??踰?留뚮굹???ㅼ뼱蹂대㈃\n?앷컖蹂대떎 ?⑥뵮 醫뗭? ?먮━濡???린寃????뺣쪧???믪뒿?덈떎\n袁몄???蹂댁뿬二쇰뒗 紐⑥뒿??洹??쒓린瑜??욌떦湲곕뒗 媛???뺤떎??諛⑸쾿?낅땲??" },
    { category: "?뫔 ?먮?", title: "?꾩씠 臾몄젣濡?留덉쓬??臾닿굅?", insight: "寃됱쑝濡?愿쒖갖? 泥숉븯吏留?n?띿쑝濡??꾩씠 嫄깆젙??怨꾩냽 ?좊굹吏 ?딆븘??, hidden1: "洹?嫄깆젙? 遺紐⑤씪硫??꾧뎄??媛뽯뒗 ?먯뿰?ㅻ윭??留덉쓬?댁뿉??n?ㅻ쭔 吏湲??꾩씠?먭쾶 ?꾩슂??嫄?議곌툑 ?ㅻⅨ 諛⑹떇??愿?ъ씠?먯슂\n洹?諛⑹떇???뚮㈃ 留덉쓬???쒓껐 媛踰쇱썙吏묐땲??, hidden2: "5?붿뿉 ?붿냼由?????꾩씠媛 醫뗭븘?섎뒗 寃??섎굹瑜?n媛숈씠 ?대낫???쒓컙???곕줈 留뚮뱾硫?n洹???踰덉쓣 怨꾧린濡?留덉쓬??臾몄씠 ?ㅼ떆 ?대┫ ?뺣쪧???믪뒿?덈떎\n洹??쒓컙???볦튂吏 ?딄퀬 ?뚯븘梨꾨뒗 寃껋씠 遺紐⑤줈??媛??????븷?낅땲??" },
    { category: "?뫔 ?먮?", title: "?꾩씠??誘몃옒媛 ?먭씀 嫄몃┝", insight: "?먭씀 ?⑤뱾 ?꾩씠? 鍮꾧탳?섍쾶 ?섍퀬\n愿쒗엳 遺덉븞??留덉쓬?????뚭? 留롮븘??, hidden1: "?꾩씠???대? ?먭린留뚯쓽 ?띾룄濡????먮씪怨??덉뼱??n?ㅻ쭔 洹??띾룄媛 ?⑤뱾怨??ㅻⅤ寃?蹂댁씪 肉먯씠?먯슂\n洹??띾룄瑜??뚯븘蹂대뒗 ?덉씠 吏湲??뱀떊?먭쾶 ?꾩슂?댁슂", hidden2: "9?붿캈???꾩씠媛 ?됱냼? ?ㅻⅤ寃?紐곗엯?섎뒗 紐⑥뒿??n?곗뿰??蹂닿쾶 ?섎뒗??n洹?遺꾩빞瑜??댁쭩 諛?댁＜硫??대뀈???덉뿉 ?꾧쾶 ?먮뱶?ъ쭏 ?뺣쪧???믪뒿?덈떎\n洹??쒓컙???볦튂吏 ?딄퀬 ?뚯븘梨꾨뒗 寃껋씠 遺紐⑤줈??媛??????븷?낅땲??" },
    { category: "?뱰 ?숈뾽", title: "?몃젰??留뚰겮 ?깆쟻?????섏샂", insight: "怨듬??섎뒗 ?쒓컙? 遺꾨챸???섏뿀?붾뜲\n寃곌낵???쒖옄由ъ뿉 癒몃Ъ???덈뒗 寃?媛숈븘??, hidden1: "洹몃룞?덉쓽 ?몃젰? ?덈? ?щ씪吏吏 ?딆븯?댁슂\n?ㅻ쭔 吏湲?諛⑹떇???뱀떊?먭쾶 ??留욎? ?딆쓣 肉먯씠?먯슂\n留욌뒗 諛⑹떇?쇰줈 諛붽씀硫?寃곌낵媛 怨??곕씪?듬땲??, hidden2: "4?붿뿉 怨듬? 諛⑹떇????媛吏留?諛붽퓭??n?붽린 ???吏곸젒 ??대낫???쒓컙???섎━硫?n?ㅼ쓬 ?쒗뿕?먯꽌 ?깆쟻???덉뿉 ?꾧쾶 ?ㅻ? ?뺣쪧???믪뒿?덈떎\n吏湲덉쓽 ?묒? ?ㅼ쿇??洹?寃곌낵瑜?留뚮뱶??媛???뺤떎??李⑥씠媛 ?⑸땲??" },
    { category: "?뱰 ?숈뾽", title: "?쒗뿕?대굹 ?⑷꺽 ?욎뿉??遺덉븞??, insight: "以鍮꾨뒗 異⑸텇????寃?媛숈???n寃곌낵瑜??앷컖?섎㈃ ?먭씀 遺덉븞?댁졇??, hidden1: "洹?遺덉븞? ?섑븯怨??띠? 留덉쓬????留뚰겮 ?앷린??嫄곗삁??n?뱀떊??以鍮꾨뒗 ?대? 異⑸텇???섏???? ?덉뼱??n吏湲??꾩슂??嫄?洹?留덉쓬??媛?쇱븠?덈뒗 ?쇰퓧?댁뿉??, hidden2: "?쒗뿕 ?????꾨???留ㅼ씪 10遺꾩뵫 留덉쓬??媛?쇱븠?덈뒗 ?쒓컙??媛吏硫?n?쒗뿕 ?뱀씪 ?됱냼蹂대떎 ?⑥뵮 李⑤텇?섍쾶 ??대궡??n?⑷꺽???뺣쪧???믪뒿?덈떎\n吏湲덉쓽 ?묒? ?ㅼ쿇??洹?寃곌낵瑜?留뚮뱶??媛???뺤떎??李⑥씠媛 ?⑸땲??" },
    { category: "?뮞 嫄닿컯", title: "?댁쑀 ?놁씠 ?먭씀 ?쇨낀??, insight: "?밸퀎??臾대━??寃껊룄 ?녿뒗??n紐몄씠 ??臾닿쾪怨?媛쒖슫???좎씠 蹂꾨줈 ?놁뼱??, hidden1: "洹??쇰줈??寃뚯쓣?ъ꽌 ?앷린??寃??꾨땲?먯슂\n?뱀떊 ?ъ＜?먯꽌 ?뱀젙 遺?꾩뿉 ?먮꼫吏媛 ?쎄쾶 ?덈뒗 ?먮쫫???덉쓣 肉먯씠?먯슂\n洹?遺?꾨? ?뚭퀬 梨꾩썙二쇰㈃ 而⑤뵒?섏씠 ?덉뿉 ?꾧쾶 ?щ씪吏묐땲??, hidden2: "3?붾????먭린 ??30遺??쇱컢 ?좊뱾怨??꾩묠??臾????붿쓣 梨숆린硫?n5?붿캈??紐몄씠 ?쒓껐 媛踰쇱썙吏?嫄?泥닿컧?섍쾶 ???뺣쪧???믪뒿?덈떎\n紐몄씠 蹂대궡???좏샇瑜?媛蹂띻쾶 ?섍린吏 ?딅뒗 寃껋씠 ?뚮났???욌떦湲곕뒗 湲몄엯?덈떎." },
    { category: "?뮞 嫄닿컯", title: "蹂묒썝 媛硫?愿쒖갖?ㅻ뒗??怨꾩냽 遺덊렪??, insight: "寃?щ? ?대룄 蹂꾨떎瑜??댁긽? ?녿떎?붾뜲\n紐몄? 怨꾩냽 ?대뵖媛 遺덊렪???먮굦???ㅼ뼱??, hidden1: "?섏튂濡쒕뒗 ??蹂댁씠吏留??ъ＜?곸쑝濡쒕뒗 遺꾨챸???좏샇媛 ?덉뼱??n紐몄씠 ?꾨땲??洹?遺?꾩? ?곌껐??留덉쓬???쇰줈?????덉뼱??n洹??곌껐???뚮㈃ 遺덊렪?⑥쓽 吏꾩쭨 ?댁쑀媛 蹂댁엯?덈떎", hidden2: "8?붿뿉 ?ㅽ듃?덉뒪???먯씤???섎뒗 ?쇱쓣 ?섎굹 ?뺣━?섍퀬 ?섎㈃\n洹?遺덊렪?섎뜕 利앹긽??媛숈씠 媛踰쇱썙吏??뺣쪧???믪뒿?덈떎\n紐몄씠 蹂대궡???좏샇瑜?媛蹂띻쾶 ?섍린吏 ?딅뒗 寃껋씠 ?뚮났???욌떦湲곕뒗 湲몄엯?덈떎." },
    { category: "?뮥 ??, title: "?ъ옄留??섎㈃ ??긽 ??대컢????醫뗭쓬", insight: "?⑤뱾 ?ㅼ뼱媛???鍮좎?怨?n?닿? ?ㅼ뼱媛硫???긽 爰얠씠???먮굦?댁뿉??, hidden1: "洹멸굔 ?댁씠 ?놁뼱?쒓? ?꾨땲???뱀떊??寃곗젙 ??대컢???먮쫫???덉뼱?쒖삁??n吏湲덇퉴吏??洹???대컢??嫄곌씀濡??怨??덉뿀??肉먯씠?먯슂\n??대컢???뚮㈃ 媛숈? ?먮떒??寃곌낵媛 ?щ씪吏묐땲??, hidden2: "10?붿뿉 ??寃곗젙???대━湲?????二쇰쭔 ??吏耳쒕낫硫?n洹??ㅼ쓬 ?ㅼ뼱媛????대컢???섏씡??蹂??뺣쪧???믪뒿?덈떎\n吏湲덈????묒? ?듦???留뚮뱾?대몢??寃껋씠 洹??먮쫫???쒕?濡?諛쏅뒗 ?듭떖?낅땲??" },
    { category: "?뮥 ??, title: "?⑤낫????쾶 ?덉씠 紐⑥씠??寃?媛숈쓬", insight: "移쒓뎄?ㅼ? ?섎굹???먮━ ?≪븘媛?붾뜲\n?섎뒗 ??긽 ??諛???뒗 寃?媛숈븘??, hidden1: "?뱀떊? ??? 寃??꾨땲???ㅻⅨ ?띾룄濡??볦씠???ъ＜?덉슂\n珥덈컲???붾뵒吏留??꾨컲???ш쾶 紐⑥씠???먮쫫???덉뼱??n洹??먮쫫???뚮㈃ 吏湲덉쓽 ?붾뵥?????댁긽 遺덉븞?섏? ?딆뒿?덈떎", hidden2: "吏湲덉쿂??留ㅻ떖 ?쇱젙 湲덉븸??袁몄???紐⑥쑝???듦?留??좎??섎㈃\n11?붿캈???쒓볼踰덉뿉 ?먯궛??遺덉뼱?섎뒗 嫄??뺤씤???뺣쪧???믪뒿?덈떎\n吏湲덈????묒? ?듦???留뚮뱾?대몢??寃껋씠 洹??먮쫫???쒕?濡?諛쏅뒗 ?듭떖?낅땲??" },
    { category: "?뮆 ?좎젙", title: "留덉쓬?????щ엺???덈뒗???ㅺ?媛湲??대젮?", insight: "???щ엺?대떎 ?띠? ?щ엺???덈뒗??n留됱긽 ?ㅺ?媛?ㅻ㈃ ?먭씀 留앹꽕?ъ졇??, hidden1: "洹?留앹꽕?꾩? 嫄곗젅???먮젮??寃??꾨땲???좎쨷???깃꺽 ?뚮Ц?댁뿉??n?ㅻ쭔 吏湲덉? ?좎쨷?⑤낫??癒쇱? ?ㅺ?媛???섎뒗 ?쒓린?덉슂\n??대컢???볦튂硫??꾩돩????ㅻ옒 ?⑥뒿?덈떎", hidden2: "6???덉뿉 媛踰쇱슫 ?쎌냽 ?섎굹瑜?癒쇱? ?쒖븞?대낫硫?n?앷컖蹂대떎 ?쎄쾶 洹??щ엺???묓븷 ?뺣쪧???믪뒿?덈떎\n留덉쓬???뺤쭅?섍쾶 ?쒗쁽?섎뒗 寃껋씠 洹??먮쫫??媛???ш쾶 ?ㅼ슦??諛⑸쾿?낅땲??" },
    { category: "?뮆 ?좎젙", title: "沅뚰깭湲곗쿂??留덉쓬???앹? 寃?媛숈쓬", insight: "?덉쟾 媛숈? ?ㅻ젞???놁뼱??n??愿怨꾧? 留욌뒗 嫄댁? ?룰컝?ㅼ슂", hidden1: "?ㅻ젞??以꾩뼱??嫄??щ옉???앸굹?쒓? ?꾨땲??愿怨꾧? ?ㅼ쓬 ?④퀎濡??섏뼱媛???좏샇?덉슂\n?ㅻ쭔 吏湲?洹??좏샇瑜??섎せ ?댁꽍?섎㈃ 吏꾩쭨 ?꾧린媛 ?⑸땲??n?쒕?濡??쎌쑝硫?愿怨꾧? ???⑤떒?댁쭏 ?쒓린?덉슂", hidden2: "7?붿뿉 ?됱냼? ?ㅻⅨ 怨녹쑝濡?吏㏃? ?ы뻾????踰??ㅻ??ㅻ㈃\n洹멸구 怨꾧린濡?愿怨꾧? ?ㅼ떆 ?곕쑜?댁쭏 ?뺣쪧???믪뒿?덈떎\n留덉쓬???뺤쭅?섍쾶 ?쒗쁽?섎뒗 寃껋씠 洹??먮쫫??媛???ш쾶 ?ㅼ슦??諛⑸쾿?낅땲??" },
    { category: "?렞 ?깃났", title: "?⑤뱾蹂대떎 ??쾶 鍮쏆쓣 蹂대뒗 ?먮굦", insight: "媛숈? 異쒕컻?좎씠?덈뜕 ?щ엺?ㅼ? ?욎꽌媛?붾뜲\n?섎뒗 ?꾩쭅 ?쒖옄由ъ씤 寃?媛숈븘??, hidden1: "?뱀떊? ??? 寃??꾨땲????쾶 ?곗????ъ＜?덉슂\n珥덈컲???볥뒗 ?쒓컙??湲몄닔濡???踰??곗쭏 ???ш쾶 ?곗쭛?덈떎\n洹??곗????쒖젏??癒몄??딆븘 ?듬땲??, hidden2: "9?붿뿉 吏湲덇퉴吏 ?볦븘??嫄???踰덉뿉 蹂댁뿬以?湲고쉶媛 ?ㅻ뒗??n洹멸구 ?볦튂吏 ?딄퀬 ?≪쑝硫??⑤쾲??二쇰ぉ諛쏆쓣 ?뺣쪧???믪뒿?덈떎\n吏湲덉쓽 ?묒? ?좏깮??洹??쒓린瑜?寃곗젙吏볥뒗 媛??以묒슂???붿냼?낅땲??" },
    { category: "?렞 ?깃났", title: "?깃났? ?덈뒗???덉쟾?⑥씠 ??, insight: "?먰븯??嫄??대쨾?붾뜲\n?앷컖蹂대떎 留덉쓬??梨꾩썙吏吏 ?딆븘??, hidden1: "洹??덉쟾?⑥? ?ㅽ뙣媛 ?꾨땲???ㅼ쓬 ?④퀎濡??섏뼱媛?以鍮꾧? ?먮떎???좏샇?덉슂\n吏湲??대， 寃껋? ?앹씠 ?꾨땲???????먮쫫???쒖옉?먯씠?먯슂\n洹??ㅼ쓬 ?먮쫫???뚮㈃ ?덉쟾?⑥씠 諛⑺뼢?쇰줈 諛붾앸땲??, hidden2: "12???꾩뿉 ?ㅼ쓬 紐⑺몴瑜?援ъ껜?곸쑝濡??섎굹 ?뺥빐?먮㈃\n?덊빐遺??洹??덉쟾?⑥씠 諛⑺뼢?쇰줈 諛붾??뺣쪧???믪뒿?덈떎\n吏湲덉쓽 ?묒? ?좏깮??洹??쒓린瑜?寃곗젙吏볥뒗 媛??以묒슂???붿냼?낅땲??" },
    { category: "?뮳 ?ъ뾽", title: "?숈뾽?먯? ?먭씀 ?섍껄??遺?ロ옒", insight: "媛숈? 紐⑺몴?몃뜲\n諛⑺뼢留??섍린?섎㈃ ?먭씀 遺?ロ???, hidden1: "洹?媛덈벑? ?ъ씠媛 ??醫뗭븘?쒓? ?꾨땲?????щ엺???먮쫫???쒕줈 ?ㅻⅨ ?쒓린???덉뼱?쒖삁??n???щ엺??留욎떠?????쒓린媛 怨??듬땲??n洹??쒓린瑜??뚮㈃ 媛덈벑???먯뿰?ㅻ읇寃?以꾩뼱??땲??, hidden2: "5?붿뿉 ??븷??紐낇솗???섎늻????붾? ??踰??쒕?濡??섎㈃\n洹??ㅻ줈 遺?ロ엳???쇱씠 ?덉뿉 ?꾧쾶 以꾩뼱???뺣쪧???믪뒿?덈떎\n?レ옄? ?щ엺 愿由щ? ?숈떆??梨숆린??寃껋씠 洹??먮쫫??吏?ㅻ뒗 鍮꾧껐?낅땲??" },
    { category: "?뮳 ?ъ뾽", title: "留ㅼ텧? ?덈뒗??留덉쓬????遺덉븞??, insight: "?レ옄濡?蹂대㈃ ?섏걯吏 ?딆???n留덉쓬? ??긽 遺덉븞?섍퀬 珥덉“?댁슂", hidden1: "洹?遺덉븞? ?レ옄 ?뚮Ц???꾨땲???ㅼ쓬 ?먮쫫????蹂댁뿬???앷린??嫄곗삁??n?뱀떊 ?ъ＜?먮뒗 遺꾨챸???곸듅 援ш컙???덉젙???덉뼱??n洹?援ш컙???뚮㈃ 吏湲덉쓽 遺덉븞???쒓껐 媛踰쇱썙吏묐땲??, hidden2: "8?붾???留ㅼ텧?????④퀎 ???ㅻⅤ???먮쫫??蹂댁씠?붾뜲\n吏湲??쏀븳 遺遺??섎굹留??뺣━?대몢硫?洹??곸듅???쒕?濡?諛쏆쓣 ?뺣쪧???믪뒿?덈떎\n?レ옄? ?щ엺 愿由щ? ?숈떆??梨숆린??寃껋씠 洹??먮쫫??吏?ㅻ뒗 鍮꾧껐?낅땲??" },
    { category: "?뭾 寃고샎", title: "寃고샎? ?덈뒗???먭씀 ?ㅽ닾寃???, insight: "?쒕줈 ?щ옉?댁꽌 寃고샎?덈뒗??n?붿쬁 ?ㅼ뼱 遺?ロ엳???쇱씠 ?섏뿀?댁슂", hidden1: "洹??ㅽ댘? ?щ옉??以꾩뼱?쒓? ?꾨땲?????щ엺???앺솢 ?먮쫫???닿툔???덉뼱?쒖삁??n?먮쫫???ㅼ떆 留욎떠吏???쒓린媛 怨??듬땲??n洹몃븣源뚯? 踰꾪떚??諛⑸쾿???뚮㈃ ?쒓껐 ?섏썡?댁쭛?덈떎", hidden2: "6?붿뿉 ?섎쭔???쒓컙???곕줈 留뚮뱾???붿쭅?섍쾶 ?섍린瑜??섎늻硫?n洹???踰덉쓽 ??붾줈 ?먮쫫???ㅼ떆 留욎떠吏??뺣쪧???믪뒿?덈떎\n?쒕줈???띾룄瑜?議댁쨷?섎뒗 留덉쓬??洹??쒓린瑜?媛???덉쟾?섍쾶 留뚮벊?덈떎." },
    { category: "?뭾 寃고샎", title: "?곷? 媛議깃낵??愿怨꾧? 遺?댁뒪?ъ?", insight: "寃고샎 ?먯껜??醫뗭???n?묎? 臾몄젣留??앷컖?섎㈃ 留덉쓬??臾닿굅?뚯졇??, hidden1: "洹?遺?댁? ?뱀떊??遺議깊빐?쒓? ?꾨땲???꾩쭅 ?쒕줈 ?듭닕?댁????쒓컙?????꾩슂?댁꽌?덉슂\n?쒓컙??吏?섎㈃ ?먯뿰?ㅻ읇寃??由щ뒗 ?먮쫫???ъ＜??蹂댁엯?덈떎\n吏湲?議곌툒?댄븯吏 ?딅뒗 寃?媛??以묒슂?댁슂", hidden2: "異붿꽍 利덉쓬 ?묒? ?덈? ?몄궗 ?섎굹瑜?癒쇱? 嫄대꽕硫?n洹멸구 怨꾧린濡?愿怨꾧? ?쒓껐 ?명빐吏??뺣쪧???믪뒿?덈떎\n?쒕줈???띾룄瑜?議댁쨷?섎뒗 留덉쓬??洹??쒓린瑜?媛???덉쟾?섍쾶 留뚮벊?덈떎." },
    { category: "?룫 吏곸옣", title: "?곸궗???愿怨꾧? ?덈Т ?섎벀", insight: "?쇱? ??留뚰븳??n?곸궗 ?뚮Ц??留ㅼ씪???ㅽ듃?덉뒪?덉슂", hidden1: "洹?留덉같? ?뱀떊???섎せ???꾨땲?????щ엺??湲곗쭏??遺?ロ엳???쒓린??肉먯씠?먯슂\n???쒓린??湲멸쾶 媛吏 ?딄퀬 怨?諛붾뚮뒗 ?먮쫫??蹂댁엯?덈떎\n洹몃븣源뚯? 踰꾪떚???붾졊???뚮㈃ ?⑥뵮 ?섏썡?댁쭛?덈떎", hidden2: "10?붿캈??議곗쭅??蹂?붽? ??踰??앷린?붾뜲\n洹?蹂???댄썑濡?吏湲덉쓽 留덉같???먯뿰?ㅻ읇寃?以꾩뼱???뺣쪧???믪뒿?덈떎\n袁몄???蹂댁뿬二쇰뒗 紐⑥뒿??洹??쒓린瑜??욌떦湲곕뒗 媛???뺤떎??諛⑸쾿?낅땲??" },
    { category: "?룫 吏곸옣", title: "吏湲??섎뒗 ?쇱씠 ?섏? ??留욌뒗 寃?媛숈쓬", insight: "?붽툒 ?뚮Ц???ㅻ땲湲??섎뒗??n???쇱씠 ??湲몄씠 留욌굹 ?먭씀 ?룰컝?ㅼ슂", hidden1: "洹??섎Ц? ?곸꽦???놁뼱?쒓? ?꾨땲??吏꾩쭨 湲몄씠 ?곕줈 ?덈떎???좏샇?덉슂\n吏湲??쇱? 洹?湲몃줈 媛湲???嫄곗퀜媛??怨쇱젙?????덉뼱??n洹?吏꾩쭨 湲몄씠 蹂댁씠???쒓린媛 癒몄??딆븯?듬땲??, hidden2: "7?붿뿉 愿???덈뜕 遺꾩빞瑜??묎쾶 ?쒕룄?대낫硫?n洹멸쾶 ?대뀈 吏꾩쭨 諛⑺뼢???섏뼱以??뺣쪧???믪뒿?덈떎\n袁몄???蹂댁뿬二쇰뒗 紐⑥뒿??洹??쒓린瑜??욌떦湲곕뒗 媛???뺤떎??諛⑸쾿?낅땲??" },
    { category: "?뫔 ?먮?", title: "?꾩씠? ??붽? ?먯젏 以꾩뼱??, insight: "?덉쟾???닿쾬?寃??섍린?덈뒗??n?붿쬁? ??붽? ?먯젏 吏㏃븘?몄슂", hidden1: "洹멸굔 ?ъ씠媛 硫?댁쭊 寃??꾨땲???꾩씠媛 ?먭린留뚯쓽 ?쒓컙???꾩슂???쒓린???ㅼ뼱??嫄곗삁??n?ㅺ?媛??諛⑹떇??議곌툑留?諛붽씀硫??ㅼ떆 留덉쓬???댁뼱以띾땲??n洹?諛⑹떇???뚮㈃ 愿怨꾧? ?ㅼ떆 媛源뚯썙吏묐땲??, hidden2: "5?붿뿉 ?붿냼由??놁씠 洹몃깷 ?놁뿉 媛숈씠 ?덉뼱二쇰뒗 ?쒓컙???섎━硫?n?щ쫫諛⑺븰易붿쓬 癒쇱? 留먯쓣 嫄몄뼱???뺣쪧???믪뒿?덈떎\n洹??쒓컙???볦튂吏 ?딄퀬 ?뚯븘梨꾨뒗 寃껋씠 遺紐⑤줈??媛??????븷?낅땲??" },
    { category: "?뫔 ?먮?", title: "?꾩씠媛 吏꾨줈瑜?紐??뺥빐???듬떟??, insight: "?댁젣 ?뺥빐?????쒓린?몃뜲\n?꾩씠媛 怨꾩냽 媛덊뙜吏덊뙜?댁슂", hidden1: "洹멸굔 ?꾩씠媛 寃뚯쓣?ъ꽌媛 ?꾨땲???꾩쭅 ?먭린 媛뺤젏??紐?李얠븯??肉먯씠?먯슂\n?꾩씠 ?ъ＜?먮뒗 遺꾨챸???먮뱶?ъ????щ뒫??諛⑺뼢???덉뼱??n洹?諛⑺뼢???뚮㈃ 吏꾨줈 怨좊????⑥뵮 媛踰쇱썙吏묐땲??, hidden2: "9?붿뿉 ?꾩씠媛 ?먯뿰?ㅻ읇寃?紐곗엯?섎뒗 ?쒕룞??吏耳쒕낫怨?n洹?諛⑺뼢???ъ찉 吏吏?댁＜硫??대뀈 遊?吏꾨줈媛 ?먮졆?댁쭏 ?뺣쪧???믪뒿?덈떎\n洹??쒓컙???볦튂吏 ?딄퀬 ?뚯븘梨꾨뒗 寃껋씠 遺紐⑤줈??媛??????븷?낅땲??" },
    { category: "?뱰 ?숈뾽", title: "怨듬????섎뒗???숆린遺?ш? ????, insight: "?댁빞 ?섎뒗 嫄??꾨뒗??n留됱긽 梨낆긽???됱쑝硫?留덉쓬?????≫???, hidden1: "洹멸굔 ?섏?媛 ?쏀빐?쒓? ?꾨땲??吏湲?紐⑺몴媛 ?먮┸?댁꽌 ?앷린???꾩긽?댁뿉??n紐⑺몴媛 ?먮졆?댁????쒓린媛 怨??ㅺ퀬 ?덉뼱??n洹??쒓린瑜??뚮㈃ ?숆린遺?ш? ?먯뿰?ㅻ읇寃??댁븘?⑸땲??, hidden2: "4?붿뿉 留됱뿰??紐⑺몴瑜??レ옄濡?援ъ껜?뷀빐???곸뼱蹂대㈃\n5?붾????숆린遺?ш? ?덉뿉 ?꾧쾶 ?댁븘???뺣쪧???믪뒿?덈떎\n吏湲덉쓽 ?묒? ?ㅼ쿇??洹?寃곌낵瑜?留뚮뱶??媛???뺤떎??李⑥씠媛 ?⑸땲??" },
    { category: "?뱰 ?숈뾽", title: "?꾧났?대굹 吏꾨줈 ?좏깮??怨좊???, insight: "?좏깮? ?댁빞 ?섎뒗??n?대뒓 履쎌씠 留욌뒗吏 ?뺤떊?????쒖슂", hidden1: "洹?留앹꽕?꾩? ?곗쑀遺?⑦빐?쒓? ?꾨땲????湲?紐⑤몢 媛?μ꽦???덉뼱?쒖삁??n?ㅻ쭔 ?뱀떊 ?ъ＜?먮뒗 ???좊━?섍쾶 ?묐룞?섎뒗 諛⑺뼢??遺꾨챸???덉뼱??n洹?諛⑺뼢???뚮㈃ ?좏깮???⑥뵮 媛踰쇱썙吏묐땲??, hidden2: "6???꾩뿉 ??湲?以????뚮━??履쎌쓣 吏㏐쾶 泥댄뿕?대낫硫?n洹?寃쏀뿕???뺤떎???듭쓣 以??뺣쪧???믪뒿?덈떎\n吏湲덉쓽 ?묒? ?ㅼ쿇??洹?寃곌낵瑜?留뚮뱶??媛???뺤떎??李⑥씠媛 ?⑸땲??" },
    { category: "?뮞 嫄닿컯", title: "?ㅽ듃?덉뒪媛 紐몄쑝濡??먭씀 ?섑???, insight: "留덉쓬留??섎뱺 寃??꾨땲??n紐몄뿉???먭씀 利앹긽???섑??섏슂", hidden1: "洹멸굔 ?쏀빐?쒓? ?꾨땲???뱀떊 ?ъ＜?먯꽌 ?ㅽ듃?덉뒪媛 ?뱀젙 遺?꾨줈 紐⑥씠???먮쫫???덉뼱?쒖삁??n洹?遺?꾨? ?뚭퀬 誘몃━ 愿由ы븯硫?利앹긽???⑥뵮 以꾩뼱??땲??n紐멸낵 留덉쓬??媛숈씠 ?뚮났?섎뒗 ?쒓린媛 ?ㅺ퀬 ?덉뼱??, hidden2: "3?붾????쇱＜?쇱뿉 ??踰?媛踰쇱슫 ?곗콉???쒖옉?섎㈃\n6?붿캈??利앹긽???덉뿉 ?꾧쾶 以꾩뼱???뺣쪧???믪뒿?덈떎\n紐몄씠 蹂대궡???좏샇瑜?媛蹂띻쾶 ?섍린吏 ?딅뒗 寃껋씠 ?뚮났???욌떦湲곕뒗 湲몄엯?덈떎." },
    { category: "?뮥 ??, title: "遺?섏엯??留뚮뱾怨??띠???萸??댁빞?좎? 紐⑤쫫", insight: "?붽툒 ?몄뿉 萸붽? ???대낫怨??띠???n萸??댁빞 ?좎? 留됰쭑?댁슂", hidden1: "?뱀떊 ?ъ＜?먮뒗 遺?섏엯???좊━???щ뒫??諛⑺뼢???곕줈 ?덉뼱??n吏湲덇퉴吏??洹?諛⑺뼢??紐?李얠븯??肉먯씠?먯슂\n諛⑺뼢???뚮㈃ ?묎쾶 ?쒖옉?대룄 寃곌낵媛 ?ㅻ쫭?덈떎", hidden2: "5?붿뿉 ?됱냼 ?섑븳?ㅺ퀬 ?ㅼ뿀?????섎굹瑜??묎쾶 ?붿븘蹂대㈃\n媛?꾩캈??洹멸쾶 袁몄???遺?섏엯?쇰줈 ?먮━?≪쓣 ?뺣쪧???믪뒿?덈떎\n吏湲덈????묒? ?듦???留뚮뱾?대몢??寃껋씠 洹??먮쫫???쒕?濡?諛쏅뒗 ?듭떖?낅땲??" },
    { category: "?뮆 ?좎젙", title: "?ы쉶瑜??앷컖?섍퀬 ?덉쓬", insight: "?ㅼ뼱議뚮뒗??n洹??щ엺???먭씀 ?앷컖?섏꽌 ?붾뱾?ㅼ슂", hidden1: "洹?留덉쓬???쒕뒗 ?곕뒗 ?ъ＜??遺꾨챸???댁쑀媛 ?덉뼱??n?ㅻ쭔 ?ы쉶媛 醫뗭? ?좏깮?몄????뱀떊 ?ъ＜???먮쫫???곕씪 ?щ씪??n洹??먮쫫???뚮㈃ ?붾뱾由щ뒗 留덉쓬???뺣━?⑸땲??, hidden2: "9?붿뿉 洹??щ엺怨??ㅼ떆 ?곕씫???우쓣 怨꾧린媛 ?앷린?붾뜲\n?덉쟾怨??묎컳? 諛⑹떇?쇰줈 ?ㅺ?媛吏 ?딆쑝硫??대쾲???ㅻⅤ寃??섎윭媛??뺣쪧???믪뒿?덈떎\n留덉쓬???뺤쭅?섍쾶 ?쒗쁽?섎뒗 寃껋씠 洹??먮쫫??媛???ш쾶 ?ㅼ슦??諛⑸쾿?낅땲??" },
    { category: "?렞 ?깃났", title: "二쇰???湲곕?媛 遺?댁뒪?ъ?", insight: "?섑븷 嫄곕씪??湲곕?瑜?留롮씠 諛쏅뒗??n洹멸쾶 ?ㅽ엳??遺?댁쑝濡??먭뺨?몄슂", hidden1: "洹?遺?댁? ?뱀떊???쏀빐?쒓? ?꾨땲??湲곕???留욌뒗 寃곌낵瑜??대뒗 ?쒓린媛 ?곕줈 ?덉뼱?쒖삁??n吏湲덉? 洹??쒓린濡?媛??怨쇱젙??肉먯씠?먯슂\n?쒓린瑜??뚮㈃ 遺?댁씠 ?뺣컯???꾨땲???숇젰???⑸땲??, hidden2: "8?붿뿉 洹?湲곕???留욌뒗 寃곌낵臾쇱씠 ?섎굹 ?섏삤?붾뜲\n洹멸구 ?붿쭅?섍쾶 怨듭쑀?섎㈃ 遺?댁씠 ?묒썝?쇰줈 諛붾??뺣쪧???믪뒿?덈떎\n吏湲덉쓽 ?묒? ?좏깮??洹??쒓린瑜?寃곗젙吏볥뒗 媛??以묒슂???붿냼?낅땲??" },
    { category: "?뮳 ?ъ뾽", title: "?뺤옣???댁빞 ?좎? ?좎?瑜??댁빞 ?좎? 怨좊???, insight: "吏湲덈낫???ㅼ슦怨??띠???n臾대━?섎뒗 嫄??꾨땶吏 怨꾩냽 怨좊??쇱슂", hidden1: "洹?怨좊?? ?뺤떖???꾨땲???좎쨷???먮떒?μ씠?먯슂\n?ㅻ쭔 ?뱀떊 ?ъ＜?먮뒗 ?뺤옣???좊━??紐낇솗???쒓린媛 ?덉뼱??n洹??쒓린 ?꾪썑濡??먮떒???섎늻硫??⑥뵮 ?덉쟾?⑸땲??, hidden2: "10???꾧퉴吏 ?먭툑 ?ъ쑀瑜??뺤씤?대몢怨?n10?붿뿉 ?묒? 洹쒕え濡?癒쇱? ?뺤옣?대낫硫?n臾대━ ?놁씠 ?ㅼ썙?섍컝 ?뺣쪧???믪뒿?덈떎\n?レ옄? ?щ엺 愿由щ? ?숈떆??梨숆린??寃껋씠 洹??먮쫫??吏?ㅻ뒗 鍮꾧껐?낅땲??" },
    { category: "?뭾 寃고샎", title: "?꾨윭?ъ쫰??寃고샎 ?쒓린瑜?紐??뺥븿", insight: "寃고샎???щ엺?대씪???뺤떊? ?덈뒗??n?몄젣媛 醫뗭쓣吏 ?쒓린瑜?紐??뺥븯怨??덉뼱??, hidden1: "洹?留앹꽕?꾩? ?뺤떊??遺議깊빐?쒓? ?꾨땲??媛??醫뗭? ?쒓린瑜?蹂몃뒫?곸쑝濡?湲곕떎由щ뒗 嫄곗삁??n?뱀떊 ?ъ＜?먮뒗 寃고샎???뱁엳 ?좊━???쒓린媛 ?곕줈 ?덉뼱??n洹??쒓린瑜??뚮㈃ 寃곗젙???⑥뵮 ?ъ썙吏묐땲??, hidden2: "11?붿뿉 ???щ엺 紐⑤몢?먭쾶 ?ъ쑀媛 ?앷린???쒓린媛 ?ㅻ뒗??n洹몃븣 ?좎쓣 ?뺥븯硫?以鍮?怨쇱젙???좊궃???쒖“濡쒖슱 ?뺣쪧???믪뒿?덈떎\n?쒕줈???띾룄瑜?議댁쨷?섎뒗 留덉쓬??洹??쒓린瑜?媛???덉쟾?섍쾶 留뚮벊?덈떎." },
    { category: "?룫 吏곸옣", title: "李쎌뾽?대굹 ?낅┰??怨좊??섍퀬 ?덉쓬", insight: "?뚯궗瑜??섍??????쇱쓣 ?대낫怨??띠???n??대컢??紐⑤Ⅴ寃좎뼱??, hidden1: "洹?怨좊?? 臾대え?댁꽌媛 ?꾨땲???낅┰???좊━???쒓린瑜?蹂몃뒫?곸쑝濡?湲곕떎由щ뒗 嫄곗삁??n?뱀떊 ?ъ＜?먮뒗 ?낅┰???좊━?섍쾶 ?묐룞?섎뒗 ?쒓린媛 遺꾨챸???덉뼱??n洹??쒓린瑜??뚮㈃ 寃곗젙???⑥뵮 ?덉쟾?댁쭛?덈떎", hidden2: "?대뀈 3???꾩뿉 理쒖냼?쒖쓽 ?먭툑怨?嫄곕옒泥??섎굹瑜?誘몃━ ?뺣낫?대몢硫?n?낅┰??泥?6媛쒖썡???덉젙?곸쑝濡??섍만 ?뺣쪧???믪뒿?덈떎\n袁몄???蹂댁뿬二쇰뒗 紐⑥뒿??洹??쒓린瑜??욌떦湲곕뒗 媛???뺤떎??諛⑸쾿?낅땲??" },
    { category: "?뫔 ?먮?", title: "?ъ텣湲??먮?? 遺?ロ엳???쇱씠 留롮쓬", insight: "?덉쟾???쒗뻽???꾩씠媛\n?붿쬁? ?먭씀 遺?ロ엳怨?諛섑빆?댁슂", hidden1: "洹멸굔 ?꾩씠媛 ?섎튌吏?寃??꾨땲???먭린 ?뺤껜?깆쓣 李얠븘媛???먯뿰?ㅻ윭??怨쇱젙?댁뿉??n吏湲?諛⑹떇?쇰줈 遺?ロ엳硫?嫄곕━媛 ??硫?댁쭏 ???덉뼱??n?ㅻⅨ ?묎렐 諛⑹떇???뚮㈃ 媛덈벑??鍮좊Ⅴ寃?以꾩뼱??땲??, hidden2: "7?붿뿉 ?붿냼由щ? ??諛뺤옄 ??텛怨?吏덈Ц?쇰줈 諛붽퓭蹂대㈃\n?щ쫫???앸굹媛?利덉쓬 遺?ロ엳???쇱씠 以꾩뼱???뺣쪧???믪뒿?덈떎\n洹??쒓컙???볦튂吏 ?딄퀬 ?뚯븘梨꾨뒗 寃껋씠 遺紐⑤줈??媛??????븷?낅땲??" },
    { category: "?뱰 ?숈뾽", title: "?좏븰?대굹 ???꾩쟾??怨좊??섍퀬 ?덉쓬", insight: "????臾대?濡?媛怨??띠???n?뺤떊?????쒖꽌 怨꾩냽 誘몃（怨??덉뼱??, hidden1: "洹?留앹꽕?꾩? ?λ젰 遺議깆씠 ?꾨땲????寃곗젙 ?욎뿉???꾧뎄??媛뽯뒗 ?먮젮??댁뿉??n?뱀떊 ?ъ＜?먮뒗 洹??꾩쟾???좊━?섍쾶 ?묐룞?섎뒗 ?쒓린媛 蹂댁엯?덈떎\n?쒓린瑜??뚮㈃ 留앹꽕?꾩씠 ?뺤떊?쇰줈 諛붾앸땲??, hidden2: "9?붿뿉 ?쒕쪟??以鍮꾨? 留덈Т由ы빐?먮㈃\n?대뀈 珥??꾩쟾???쒖옉????鍮좊Ⅴ寃??먮━?≪쓣 ?뺣쪧???믪뒿?덈떎\n吏湲덉쓽 ?묒? ?ㅼ쿇??洹?寃곌낵瑜?留뚮뱶??媛???뺤떎??李⑥씠媛 ?⑸땲??" },
    { category: "?뮞 嫄닿컯", title: "?섎㈃ 臾몄젣濡?怨꾩냽 ?쇨낀??, insight: "?좎쓣 ?먮룄 ?????먮굦???녾퀬\n??뿉??怨꾩냽 ?쇨낀?댁슂", hidden1: "洹멸굔 ?⑥닚??泥대젰 臾몄젣媛 ?꾨땲???뱀떊 ?ъ＜?먯꽌 留덉쓬???ъ? 紐삵븯???먮쫫???덉뼱?쒖삁??n?앷컖??留롮? ?쒓린?쇱닔濡??좎씠 ?뺤븘吏??寃쏀뼢???덉뼱??n洹??먮쫫???뚮㈃ ?섎㈃??吏덉씠 ?щ씪吏묐땲??, hidden2: "?먭린 ???대??곗쓣 30遺?癒쇱? ?대젮?볥뒗 ?듦???4?붾????ㅼ씠硫?n6?붿캈???섎㈃??吏덉씠 ?덉뿉 ?꾧쾶 ?щ씪吏??뺣쪧???믪뒿?덈떎\n紐몄씠 蹂대궡???좏샇瑜?媛蹂띻쾶 ?섍린吏 ?딅뒗 寃껋씠 ?뚮났???욌떦湲곕뒗 湲몄엯?덈떎." },
    { category: "?뮥 ??, title: "鍮싳씠???異??뚮Ц??留덉쓬??臾닿굅?", insight: "媛싳븘????寃??덈떎??寃?n??긽 留덉쓬 ?쒓뎄?앹쓣 臾닿쾪寃??뚮윭??, hidden1: "洹?臾닿쾶???λ젰???놁뼱?쒓? ?꾨땲??吏湲덉씠 ?뺣━???쒓린?닿린 ?뚮Ц?댁뿉??n?뱀떊 ?ъ＜?먮뒗 遺?댁씠 媛踰쇱썙吏???먮쫫??遺꾨챸??蹂댁엯?덈떎\n洹??먮쫫???뚮㈃ 吏湲덉쓽 臾닿쾶媛 寃щ뵜留뚰빐吏묐땲??, hidden2: "5?붿뿉 媛싲뒗 ?쒖꽌瑜?湲덈━ ?믪? 寃껊????ㅼ떆 ?뺣━?섎㈃\n?곕쭚源뚯? 遺?댁씠 ?덉뿉 ?꾧쾶 媛踰쇱썙吏??뺣쪧???믪뒿?덈떎\n吏湲덈????묒? ?듦???留뚮뱾?대몢??寃껋씠 洹??먮쫫???쒕?濡?諛쏅뒗 ?듭떖?낅땲??" },
    { category: "?렞 ?깃났", title: "踰덉븘?껋씠 ????섏슃???놁쓬", insight: "?덉쟾???댁젙 ?섏낀?붾뜲\n?붿쬁? 萸??대룄 ?섏슃?????앷꺼??, hidden1: "洹멸굔 寃뚯쓣?ъ쭊 寃??꾨땲???덈Т ?ㅻ옒 媛숈? 諛⑺뼢?쇰줈 ?щ젮????앷릿 ?먯뿰?ㅻ윭???좏샇?덉슂\n吏湲덉? ?좎떆 硫덉텛怨?諛⑺뼢???ㅼ떆 ?먭????쒓린?덉슂\n洹??먭????앸굹硫???媛뺥븳 ?섏슃???뚯븘?듬땲??, hidden2: "8?붿뿉 ?쇱＜???뺣룄 ?쒕?濡??щ뒗 ?쒓컙??留뚮뱾?대몢硫?n9?붾????덉쟾蹂대떎 ??媛뺥븳 ?섏슃???뚯븘???뺣쪧???믪뒿?덈떎\n吏湲덉쓽 ?묒? ?좏깮??洹??쒓린瑜?寃곗젙吏볥뒗 媛??以묒슂???붿냼?낅땲??" },
    { category: "?뮳 ?ъ뾽", title: "吏곸썝?대굹 嫄곕옒泥섏????좊ː 臾몄젣濡?怨좊???, insight: "誘욧퀬 留↔꼈?붾뜲\n寃곌낵媛 湲곕?? ?щ씪???먭씀 留덉쓬???곹빐??, hidden1: "洹??ㅻ쭩? ?щ엺???섎せ 蹂?寃??꾨땲???쒕줈 ?좊ː瑜??볥뒗 ?쒓린瑜?吏?섎뒗 以묒씠?먯슂\n?뱀떊 ?ъ＜?먮뒗 醫뗭? ?щ엺???뚯븘蹂대뒗 ?덈ぉ??媛뺥븯寃??묐룞?섎뒗 ?쒓린媛 ?덉뼱??n洹??쒓린瑜??뚮㈃ ?щ엺 臾몄젣媛 ?⑥뵮 以꾩뼱??땲??, hidden2: "10?붿뿉 ?덈줈??嫄곕옒泥섎굹 吏곸썝???ㅼ씠寃??섎뒗??n?대쾲???덈ぉ???뺥솗?섍쾶 ?묐룞???ㅻ옒 媛??щ엺???뚯븘蹂??뺣쪧???믪뒿?덈떎\n?レ옄? ?щ엺 愿由щ? ?숈떆??梨숆린??寃껋씠 洹??먮쫫??吏?ㅻ뒗 鍮꾧껐?낅땲??" },
    { category: "?뭾 寃고샎", title: "鍮꾪샎??怨좊??섍퀬 ?덉쓬", insight: "寃고샎??瑗??꾩슂?쒖?\n?붿쬁 ?먭씀 ?섎Ц???ㅼ뼱??, hidden1: "洹??섎Ц? ?섎せ??寃??꾨땲???뱀떊留뚯쓽 ?듭쓣 李얠븘媛??怨쇱젙?댁뿉??n?ㅻ쭔 ?뱀떊 ?ъ＜?먮뒗 寃고샎???좊━?섍쾶 ?묐룞?섎뒗 ?먮쫫??遺꾨챸??議댁옱?댁슂\n洹??먮쫫???뚮㈃ ???뺤떊 ?덈뒗 ?좏깮???????덉뒿?덈떎", hidden2: "11?붿캈??留덉쓬????諛⑺뼢?쇰줈 ?먮졆?섍쾶 湲곗슦??怨꾧린媛 ?앷린?붾뜲\n洹??좏샇瑜??곕씪媛硫??대뼡 ?좏깮?대뱺 ?꾪쉶 ?놁쓣 ?뺣쪧???믪뒿?덈떎\n?쒕줈???띾룄瑜?議댁쨷?섎뒗 留덉쓬??洹??쒓린瑜?媛???덉쟾?섍쾶 留뚮벊?덈떎." },
    { category: "?룫 吏곸옣", title: "?뚯궗?먯꽌 ?낆?媛 ?먯젏 醫곸븘吏???먮굦", insight: "?덉쟾?????먮━媛 遺꾨챸?덈뒗??n?붿쬁? ?먯젏 ?꾩튂媛 ?좊ℓ?댁???寃?媛숈븘??, hidden1: "洹멸굔 ?λ젰???⑥뼱吏?寃??꾨땲??議곗쭅 ?덉쓽 ?먮쫫??諛붾뚮뒗 怨쇰룄湲곗씪 肉먯씠?먯슂\n?뱀떊 ?ъ＜?먮뒗 ?ㅼ떆 ?낆?瑜??⑤떒???ㅼ????쒓린媛 蹂댁엯?덈떎\n洹??쒓린瑜??뚮㈃ 吏湲덉쓽 遺덉븞???⑥뵮 媛踰쇱썙吏묐땲??, hidden2: "6?붿뿉 ?묒? ?꾨줈?앺듃 ?섎굹瑜??먯썝?댁꽌 留≪쑝硫?n9?붿캈??洹?寃곌낵濡??낆?媛 ?ㅼ떆 ?⑤떒?댁쭏 ?뺣쪧???믪뒿?덈떎\n袁몄???蹂댁뿬二쇰뒗 紐⑥뒿??洹??쒓린瑜??욌떦湲곕뒗 媛???뺤떎??諛⑸쾿?낅땲??" },
    { category: "?뫔 ?먮?", title: "?꾩떊?대굹 異쒖궛 ?쒓린瑜?怨좊??섍퀬 ?덉쓬", insight: "?꾩씠??媛뽮퀬 ?띠???n吏湲덉씠 留욌뒗 ?쒓린?몄? 怨꾩냽 怨좊??쇱슂", hidden1: "洹?怨좊?? 留앹꽕?꾩씠 ?꾨땲???좎쨷?섍쾶 以鍮꾪븯??留덉쓬?댁뿉??n?뱀떊 ?ъ＜?먮뒗 ?뱁엳 ?쒖“濡쒖슫 ?먮쫫???묐룞?섎뒗 ?쒓린媛 ?곕줈 ?덉뼱??n洹??쒓린瑜??뚮㈃ 寃곗젙???⑥뵮 ?몄븞?댁쭛?덈떎", hidden2: "?대뀈 遊꾧퉴吏媛 ?뱁엳 ?쒖“濡쒖슫 ?먮쫫?몃뜲\n吏湲덈???紐멸낵 留덉쓬??誘몃━ 以鍮꾪빐?먮㈃ 洹??쒓린媛 ?쒓껐 ?몄븞???뺣쪧???믪뒿?덈떎\n洹??쒓컙???볦튂吏 ?딄퀬 ?뚯븘梨꾨뒗 寃껋씠 遺紐⑤줈??媛??????븷?낅땲??" },
];

// 臾대즺 遺꾩꽍?먯꽌 ?ъ슜?먭? 吏곸젒 怨좊Ⅸ 移댄뀒怨좊━(?щЪ???곗븷???깃났??嫄닿컯????瑜?// "?뱀떊??蹂?? 50媛??쒗뵆由우쓽 移댄뀒怨좊━濡?留ㅽ븨 ???꾩쟾 臾댁옉??留ㅼ묶?쇰줈 ?명빐
// 湲고샎?먯뿉寃?"鍮꾪샎 怨좊?" 媛숈? ?꾪? ??留욌뒗 ?댁슜???⑤뒗 臾몄젣瑜?以꾩엫
const SELECTED_CAT_TO_CHANGE_CAT: Record<string, string> = {
  "?뮥 ?щЪ??: "?뮥 ??,
  "?뮆 ?곗븷??: "?뮆 ?좎젙",
  "?렞 ?깃났??: "?렞 ?깃났",
  "?뮞 嫄닿컯??: "?뮞 嫄닿컯",
};

function getYourChangeType(name: string, birthYear: string | number, birthMonth: string | number, birthDay: string | number, selectedCategory?: string, directInterest?: string | null) {
  const fullData = String(name) + String(birthYear) + String(birthMonth) + String(birthDay);
  let hash = 0;
  for (let i = 0; i < fullData.length; i++) hash += fullData.charCodeAt(i);
  hash += (parseInt(String(birthMonth)) || 0) * 7;
  hash += (parseInt(String(birthDay)) || 0) * 13;
  hash += (parseInt(String(birthYear)) || 0) * 3;

  // ?ъ슜?먭? 吏곸젒 怨좊Ⅸ 愿?ъ궗(directInterest)媛 媛???뺥솗???좏샇?닿퀬,
  // ?놁쑝硫?遺꾩꽍 ?쒖옉 ???좏깮??移댄뀒怨좊━(selectedCategory) 留ㅽ븨???쒕룄??  const mappedCat = directInterest ?? (selectedCategory ? SELECTED_CAT_TO_CHANGE_CAT[selectedCategory] : undefined);
  const pool = mappedCat ? YOUR_CHANGE_TYPES.filter(t => t.category === mappedCat) : YOUR_CHANGE_TYPES;
  const target = pool.length > 0 ? pool : YOUR_CHANGE_TYPES;

  // "?ㅻ뒛???댁꽭"??留ㅼ씪 ?쒓났?섎뒗??媛숈? ?щ엺쨌媛숈? 移댄뀒怨좊━硫???긽 媛숈? ?쒗뵆由용쭔
  // ?섏삤硫?留ㅼ씪 遊먮룄 ?묎컳?꾩꽌 ?댁긽?????좎쭨瑜??욎뼱 洹몃궇洹몃궇 ? ?덉뿉???ㅼ쓬 ?쒗뵆由우쑝濡?  // ?섎（???뚯븘媛寃???媛숈? ???덉뿉?쒕뒗 洹몃?濡?怨좎젙, ?ㅼ쓬 ?좎뿏 ?먮룞?쇰줈 ?ㅻⅨ ?쒗뵆由?
  const daysSinceEpoch = Math.floor(Date.now() / 86400000);
  return target[Math.abs(hash + daysSinceEpoch) % target.length];
}

// 臾몄옣??湲???移대뱶 ?덈퉬??留욎떠 CSS濡쒕쭔 以꾨컮轅덉쓣 留↔린硫?臾몄옣留덈떎 湲몄씠媛 ?щ씪
// ?쒖そ??嫄곗쓽 ??李④퀬 ???⑥뼱留??⑤뒗 ?앹쑝濡??ㅼ춬?좎춬?댁쭚 ??洹몃옒???쇱젙 湲몄씠媛
// ?섎뒗 臾몄옣? 以묎컙 吏?먯뿉 媛??媛源뚯슫 ?꾩뼱?곌린?먯꽌 吏곸젒 ?섎씪 ??以꾨줈 媛뺤젣 遺꾨━??function splitLong(line: string, threshold = 22): string[] {
  if (line.length <= threshold) return [line];
  const mid = Math.floor(line.length / 2);
  let best = -1;
  let bestDist = Infinity;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === " ") {
      const dist = Math.abs(i - mid);
      if (dist < bestDist) { bestDist = dist; best = i; }
    }
  }
  if (best === -1) return [line];
  return [line.slice(0, best), line.slice(best + 1)];
}

const ALL_SCORE_CATS = [
  { key: "?뙚 ?ㅻ뒛???댁꽭", scoreKey: "total",  color: "#f59e0b", icon: "?뙚" },
  { key: "?뮥 ?щЪ??,      scoreKey: "wealth", color: "#f59e0b", icon: "?뮥" },
  { key: "?뮆 ?곗븷??,      scoreKey: "love",   color: "#ec4899", icon: "?뮆" },
  { key: "?뮞 嫄닿컯??,      scoreKey: "health", color: "#10b981", icon: "?뮞" },
  { key: "?렞 ?깃났??,      scoreKey: "success",color: "#8b5cf6", icon: "?렞" },
  { key: "??珥앹슫",        scoreKey: "total",  color: "#6366f1", icon: "?? },
];

const FREE_CAT = "?뙚 ?ㅻ뒛???댁꽭";
const SELECT_CATS = ALL_SCORE_CATS.filter(c => c.key !== FREE_CAT);

type PkgCat = { apiKey: string; icon: string; label: string; color: string };
// ?ы빐?댁꽭쨌?붾퀎?댁꽭媛 ?섎???遺숈쑝硫?媛숈? ?섍린瑜???踰??섎뒗 寃껋쿂???먭뺨?몄꽌,
// ?щЪ?는룹뿰?좎슫(+嫄닿컯???????ъ씠???쇱썙 ?⑥뼱?⑤젮 ?? ??諛곗뿴 ?쒖꽌媛 寃곌낵吏??// ?ㅼ젣濡?蹂댁씠???쒖꽌媛 ??lib/constants.ts???⑦궎吏 援ъ꽦怨?留욎떠??
const PKG_CAT_MAP: Record<string, PkgCat[]> = {
  "湲곕낯 遺꾩꽍": [
    { apiKey: "?뮥 ?щЪ??,    icon: "?뭿", label: "?щЪ??,    color: "#f59e0b" },
    { apiKey: "?뮆 ?곗븷??,    icon: "?뮆", label: "?곗븷??,    color: "#ec4899" },
  ],
  "踰좎씠吏?: [
    { apiKey: "?截??ы빐 ?댁꽭", icon: "?截?, label: "?ы빐 ?댁꽭", color: "#f59e0b" },
    { apiKey: "?뮥 ?щЪ??,    icon: "?뭿", label: "?щЪ??,    color: "#f59e0b" },
    { apiKey: "?뮆 ?곗븷??,    icon: "?뮆", label: "?곗븷??,    color: "#ec4899" },
    { apiKey: "?뱟 ?붾퀎?댁꽭",  icon: "?뙔", label: "?붾퀎 ?댁꽭", color: "#0ea5e9" },
  ],
  "?꾨━誘몄뾼": [
    { apiKey: "?截??ы빐 ?댁꽭", icon: "?截?, label: "?ы빐 ?댁꽭", color: "#f59e0b" },
    { apiKey: "?뮥 ?щЪ??,    icon: "?뭿", label: "?щЪ??,    color: "#f59e0b" },
    { apiKey: "?뮆 ?곗븷??,    icon: "?뮆", label: "?곗븷??,    color: "#ec4899" },
    { apiKey: "?뱟 ?붾퀎?댁꽭",  icon: "?뙔", label: "?붾퀎 ?댁꽭", color: "#0ea5e9" },
    { apiKey: "?뮞 嫄닿컯??,    icon: "?뙼", label: "嫄닿컯??,    color: "#10b981" },
  ],
  "VIP 而ㅽ뵆??: [
    { apiKey: "?뱷 ?대쫫遺꾩꽍",     icon: "?뱷", label: "?대쫫遺꾩꽍",     color: "#6366f1" },
    { apiKey: "?截??ы빐 ?댁꽭",   icon: "?截?, label: "?ы빐 ?댁꽭",    color: "#f59e0b" },
    { apiKey: "?뮥 ?щЪ??,      icon: "?뭿", label: "?щЪ??,       color: "#f59e0b" },
    { apiKey: "?뮆 ?곗븷??,      icon: "?뮆", label: "?곗븷??,       color: "#ec4899" },
    { apiKey: "?뮞 嫄닿컯??,      icon: "?뙼", label: "嫄닿컯??,       color: "#10b981" },
    { apiKey: "?뭾 寃고샎쨌沅곹빀??, icon: "?뫉", label: "沅곹빀遺꾩꽍",     color: "#f43f5e" },
    { apiKey: "?뱟 ?붾퀎?댁꽭",    icon: "?뙔", label: "?붾퀎 ?댁꽭",    color: "#0ea5e9" },
    { apiKey: "?뮳 ?꾩껜 ?ъ＜遺꾩꽍", icon: "??, label: "?꾩껜 ?ъ＜遺꾩꽍", color: "#8b5cf6" },
  ],
};

function ScoreCircle({ score, size = 120 }: { score: number; size?: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 300);
    return () => clearTimeout(t);
  }, [score]);
  const dash = (animated / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="white" strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dasharray 1.2s ease" }} />
      <text x="50" y="46" textAnchor="middle" fill="white" fontSize="20" fontWeight="900">{animated}</text>
      <text x="50" y="60" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="700">/ 100</text>
    </svg>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 400);
    return () => clearTimeout(t);
  }, [score]);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 900, color }}>{score}??/span>
      </div>
      <div style={{ height: 7, background: "#f3e8ff", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

function saveToHistory(r: any, isPaid: boolean, analyses: Record<string, string>, paidCats: string[], planType: string) {
  if (!r?.histId || !isPaid) return;
  try {
    const hist = JSON.parse(localStorage.getItem("v2_history") || "[]");
    const date = r.savedAt ?? new Date().toISOString();
    const cats = paidCats.length > 0 ? paidCats : Object.keys(analyses);
    cats.forEach((cat, i) => {
      const id = `${r.histId}-${i}`;
      if (hist.some((h: any) => h.id === id)) return;
      hist.unshift({
        id, date,
        name: r.profile?.name ?? "",
        category: cat,
        scores: r.scores ?? {},
        analysis: analyses[cat] ?? "",
        isPaid: true,
        planType,
        birthYear: r.profile?.birthYear ?? "",
        luckyColor: r.luckyColor ?? "",
        luckyNumber: r.luckyNumber ?? "",
        luckyDirection: r.luckyDirection ?? "",
      });
    });
    localStorage.setItem("v2_history", JSON.stringify(hist.slice(0, 50)));
  } catch {}
}

export default function V2Result() {
  return (
    <Suspense fallback={null}>
      <V2ResultInner />
    </Suspense>
  );
}

function V2ResultInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // saving ?곹깭(state)??媛깆떊??鍮꾨룞湲곕씪 踰꾪듉??鍮좊Ⅴ寃???踰??꾨Ⅴ硫??ъ쭊??泥댄겕瑜?  // ?듦낵?대쾭????μ씠 以묐났 ?ㅽ뻾?????덉쓬 ??ref??利됱떆 媛깆떊?섎?濡??닿구濡?留됱쓬
  const savingRef = useRef(false);

  const [result, setResult] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [allAnalyses, setAllAnalyses] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [changeInterest, setChangeInterest] = useState<string | null>(null);
  const [bannerIdx, setBannerIdx] = useState(0);

  const BANNER_MSGS = ["?ㅻ뒛 ?щЪ?댁씠 ?대뼥源?", "痍⑥뾽 ??寃?媛숈븘?", "?곗븷???뚮젮以?", "?댁쭅 ??대컢 留욎븘?", "?ы빐 ?諛??섎뒗 ???몄젣??", "??媛뺤젏??萸먯빞?"];
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNER_MSGS.length), 700);
    return () => clearInterval(t);
  }, []);

  const [showSelect, setShowSelect] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>(SELECT_CATS.map(c => c.key));
  // 怨듭쑀?섍린 ?꾩뿉 "?앸뀈?붿씪 ?뺣낫(?졖룹삤??誘몃━蹂닿린)瑜?媛숈씠 蹂댁뿬以꾩?" 怨좊? ???덇쾶 ????  // 湲곕낯? 耳쒖쭚(湲곗〈怨??숈씪 ?숈옉), ?꾨㈃ ?대쫫+遺꾩꽍湲留?怨듭쑀?섍퀬 ?앸뀈?붿씪 湲곕컲 ?뺣낫??鍮좎쭚
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareIncludeBirth, setShareIncludeBirth] = useState(true);
  // ?뚰듃???쒕툕?꾨찓?몄뿉?쒕뒗 "?뱀떊??蹂??(990??寃곗젣 ?좊룄??蹂대꼫??移대뱶) ?먯껜瑜??④?.
  // ?ㅼ씠???깃툒 ?뚰듃?덉쓽 ?쒕툕?꾨찓?몄씠硫?"?먯슫" ???洹??뚰듃??釉뚮옖???곹샇紐끒룸줈怨?濡??쒖떆
  const [isPartner, setIsPartner] = useState(false);
  const [brand, setBrand] = useState<{ businessName: string; logoUrl: string } | null>(null);
  useEffect(() => {
    const hostname = window.location.hostname;
    const partner = isPartnerHost(hostname);
    setIsPartner(partner);
    if (partner) {
      const slug = hostname.split(".")[0];
      fetch(`/api/partner/brand?subdomain=${encodeURIComponent(slug)}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setBrand(data); })
        .catch(() => {});
    }
  }, []);

  const [paidCats, setPaidCats] = useState<string[]>([]);
  const [selPlan, setSelPlan] = useState("vip");
  const [payBusy, setPayBusy] = useState(false);
  const [planType, setPlanType] = useState("");
  const [tier, setTier] = useState<"free" | "select" | "package">("free");
  const [pkgName, setPkgName] = useState("");
  const [couponPhone, setCouponPhone] = useState("");
  const [couponSubmitting, setCouponSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const readChunksRef = useRef<string[]>([]);
  const readIdxRef = useRef(0);
  const restartingRef = useRef(false);
  // ?붾㈃??爰쇱죱??耳쒖쭏 ??紐⑤컮??OS媛 ?뚯꽦 ?ъ깮??議곗슜??硫덉떠踰꾨━??寃쎌슦媛 ?덉쓬(JS
  // ?먮윭 ?놁씠 洹몃깷 ?뚮━留??딄?) ???대븣 speaking ?곹깭??true濡??⑥븘?덈뒗???ㅼ젣
  // ?ъ깮? 硫덉텣 ?곹깭媛 ?섏뼱, 踰꾪듉???뚮윭??"硫덉텛湲?留??숈옉?섍퀬 ?ㅼ떆 ?뚮윭???댁뼱
  // ?쎄린媛 ?쒖옉?섎뒗 遺덊렪???덉뿀?? resumeAfterHideRef??理쒖떊 ?ш컻 濡쒖쭅???댁븘?먭퀬
  // visibilitychange濡??붾㈃???ㅼ떆 蹂댁씪 ???먮룞?쇰줈 ?댁뼱 ?쎈룄濡????꾨옒?먯꽌 梨꾩?)
  const resumeAfterHideRef = useRef<() => void>(() => {});
  // 媛留뚰엳 ?ｊ린留??섎㈃ ?덈뱶濡쒖씠???꾩씠?곗씠 ?붾㈃蹂댄샇湲곗쿂???먮룞?쇰줈 ?붾㈃??爰쇰쾭?ㅼ꽌
  // ?쎄린媛 ?딄린??寃쎌슦媛 留롮븯?????쎈뒗 ?숈븞?먮뒗 ?붾㈃????덈줈 爰쇱?吏 ?딄쾶 ?좉???  // (吏?????섎뒗 援ы삎 釉뚮씪?곗??먯꽌??洹몃깷 議곗슜??臾댁떆??
  const wakeLockRef = useRef<any>(null);
  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
    } catch {}
  };
  const releaseWakeLock = () => {
    try { wakeLockRef.current?.release(); } catch {}
    wakeLockRef.current = null;
  };

  const INLINE_PLANS = [
    { id: "vip", icon: "?맪", name: "??肄붿뒪", badge: "?몣 理쒓퀬", desc: "??,990", price: 9990, priceStr: "??,990", per: "臾댁젣??, features: ["AI ?ъ링 遺꾩꽍", "??遺꾩빞 ?ъ＜ 遺꾩꽍 + ?ъ뾽??珥앹슫", "?붾퀎+?ㅻ뒛 ?댁꽭", "寃고샎??沅곹빀 遺꾩꽍 ?ы븿"] },
  ];

  const INLINE_SELECT_CATS = [
    { key: "?뮥 ?щЪ??, icon: "?뮥", color: "#f59e0b" },
    { key: "?뮆 ?곗븷??, icon: "?뮆", color: "#ec4899" },
    { key: "?뮞 嫄닿컯??, icon: "?뮞", color: "#10b981" },
    { key: "?렞 ?깃났??, icon: "?렞", color: "#8b5cf6" },
    { key: "??珥앹슫",   icon: "??, color: "#6366f1" },
  ];

  // ???붾㈃??踰쀬뼱?섎㈃(濡쒓렇?꾩썐, ?ㅻ줈媛湲??? ?쎌뼱二쇨린媛 怨꾩냽 ?뚯븘媛吏 ?딅룄濡?  // ?붾㈃???щ씪吏????뚯꽦??媛뺤젣濡?硫덉땄
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      releaseWakeLock();
    };
  }, []);

  // ?붾㈃??爰쇱죱?ㅺ? ?ㅼ떆 耳쒖?硫????먯껜????二쎌뿀吏留??뚯꽦 ?ъ깮留??딄릿 寃쎌슦) ?먮룞?쇰줈
  // ?댁뼱 ?쎄린瑜??쒕룄????resumeAfterHideRef.current???꾨옒?먯꽌 留??뚮뜑留덈떎 理쒖떊 ?곹깭濡?媛깆떊??  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") resumeAfterHideRef.current();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const raw = sessionStorage.getItem("v2_result");
    if (!raw) {
      // ?ㅻⅨ 釉뚮씪?곗?濡??댁뼱???꾩떆 ??μ냼(?몄뀡)媛 鍮꾩뼱?덈뒗 寃쎌슦 ??二쇱냼??      // 怨듭쑀 id(sid)媛 媛숈씠 遺숈뼱?붾떎硫? 泥섏쓬遺???ㅼ떆 遺꾩꽍?섏? ?딄퀬??      // 洹?寃곌낵瑜?洹몃?濡?蹂????덈뒗 怨듭쑀 ?섏씠吏濡????蹂대궡以?      const sid = searchParams.get("sid");
      if (sid) { router.replace(`/main-v2/share/${sid}`); return; }
      router.replace("/main-v2/analysis");
      return;
    }
    const r = JSON.parse(raw);
    if (!r.histId) {
      r.histId = Date.now();
      r.savedAt = new Date().toISOString();
      sessionStorage.setItem("v2_result", JSON.stringify(r));
    }
    setResult(r);

    const price = sessionStorage.getItem("price") ?? "";
    const PKG_PRICES_SET = ["9900", "19900", "24900", "29900"];
    const isPackage = PKG_PRICES_SET.includes(price);
    const isSelect = price === "990";
    const v2Paid = sessionStorage.getItem("v2_paid") === "1";
    const isPaid = isPackage || isSelect || v2Paid;
    const rawPlan = sessionStorage.getItem("v2_plan") ?? "";
    const plan = isPackage ? "package" : isSelect ? "select" : (v2Paid ? rawPlan : "");
    const detectedTier: "free" | "select" | "package" = plan === "package" ? "package" : plan === "select" ? "select" : "free";

    setTier(detectedTier);
    if (isPackage) setPkgName(sessionStorage.getItem("selectedPackage") ?? "");
    setPaid(isPaid);
    setPlanType(plan);
    const analyses = isPaid ? (r.allAnalyses ?? {}) : {};
    setAllAnalyses(analyses);
    const cats = (() => {
      if (!isPaid) return [];
      if (isPackage) {
        const pkg = sessionStorage.getItem("selectedPackage") ?? "";
        return (PKG_CAT_MAP[pkg] ?? PKG_CAT_MAP["湲곕낯 遺꾩꽍"]).map(c => c.apiKey);
      }
      const saved = sessionStorage.getItem("v2_paid_cats");
      return saved ? JSON.parse(saved) : SELECT_CATS.map(c => c.key);
    })();
    if (isPaid) setPaidCats(cats);
    if (isPaid && Object.keys(analyses).length > 0) {
      if (isPackage) {
        const pkg = sessionStorage.getItem("selectedPackage") ?? "";
        const pkgCats = PKG_CAT_MAP[pkg] ?? PKG_CAT_MAP["湲곕낯 遺꾩꽍"];
        const labelAnalyses: Record<string, string> = {};
        pkgCats.forEach(c => { labelAnalyses[`${c.icon} ${c.label}`] = analyses[c.apiKey] ?? ""; });
        saveToHistory(r, isPaid, labelAnalyses, pkgCats.map(c => `${c.icon} ${c.label}`), plan);
      } else {
        saveToHistory(r, isPaid, analyses, cats, plan);
      }
    }

    // 寃곌낵瑜??쒕쾭?먮룄 ?먮룞 ??ν빐?? 釉뚮씪?곗?瑜?諛붽퓭???? 移댁뭅?ㅽ넚 ?몄빋
    // 釉뚮씪?곗? ?쒓퀎濡?"?ㅻⅨ 釉뚮씪?곗?濡??닿린") ?ㅼ떆 遺꾩꽍?섏? ?딄퀬 洹몃?濡?    // ?댁뼱??蹂닿퀬 ?쎌쓣 ???덇쾶 ?????ㅽ뙣?대룄 ?붾㈃ ?먯껜??洹몃?濡?蹂댁씠?꾨줉 議곗슜??臾댁떆
    (async () => {
      try {
        const shareCategories =
          !isPaid ? [{ icon: "?뙚", label: "?ㅻ뒛???댁꽭", color: "#f59e0b", text: r.analysis ?? "" }]
          : isPackage
            ? (PKG_CAT_MAP[sessionStorage.getItem("selectedPackage") ?? ""] ?? PKG_CAT_MAP["湲곕낯 遺꾩꽍"])
                .filter(c => analyses[c.apiKey]).map(c => ({ icon: c.icon, label: c.label, color: c.color, text: analyses[c.apiKey], badge: "?벀 ?⑦궎吏" }))
            : ALL_SCORE_CATS.filter(c => c.key !== FREE_CAT && cats.includes(c.key))
                .map(c => ({ icon: c.icon, label: c.key.replace(/\S+\s/, ""), color: c.color, text: analyses[c.key], badge: "?뭿 ?ъ링" }));
        const validCats = shareCategories.filter(c => c.text && c.text.trim());
        if (validCats.length === 0) return;
        const res = await fetch("/api/v2/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: r.profile?.name, scores: r.scores, luckyColor: r.luckyColor, luckyNumber: r.luckyNumber, luckyDirection: r.luckyDirection, categories: validCats, tier: isPackage ? "package" : isPaid ? "select" : "free", birthYear: r.profile?.birthYear }),
        });
        if (res.ok) {
          const data = await res.json();
          const sp = new URLSearchParams(window.location.search);
          sp.set("sid", data.id);
          router.replace(`${window.location.pathname}?${sp.toString()}`, { scroll: false });
        }
      } catch {}
    })();
  }, []);

  // "?뱀떊??蹂?? ?꾩껜怨듦컻瑜??ㅻ뒛 泥섏쓬 蹂댁뿬二쇰뒗 嫄곕씪硫? 洹??ъ떎??localStorage??  // 湲곕줉 ???뚮뜑留??⑥닔 ?덉뿉??吏곸젒 ?곗? ?딄퀬 ?ш린(useEffect)?먯꽌留??⑥빞 ??  // ?좊즺 "?뱀떊??蹂?????꾩껜怨듦컻" 移대뱶??臾대즺 履쎄낵 ?묎컳? 臾몄젣媛 ?덉뿀????  // "?대? ??遊ㅻ뒗吏"瑜??뚮뜑留곷쭏???덈줈 ?쎌쑝硫? ???④낵媛 諛⑷툑 consumedKey瑜?  // "1"濡??⑤쾭由?吏곹썑 ?ㅼ떆 ?뚮뜑留??쎄린 ??????移대뱶媛 ?щ씪??蹂댁???
  // 洹몃옒?????섏씠吏??泥섏쓬 ?ㅼ뼱?붿쓣 ?뚯쓽 媛??곌린 ??媛????ㅻ깄?룹쑝濡?怨좎젙?대몺
  const [paidConsumedSnapshot, setPaidConsumedSnapshot] = useState<boolean | null>(null);
  useEffect(() => {
    const p = result?.profile;
    if (!p?.name || !p?.birthYear) return;
    if (tier !== "select" && tier !== "package") return;
    const interestOptions = ["?뮥 ??, "?뮆 ?좎젙", "?렞 ?깃났", "?뮳 ?ъ뾽", "?뭾 寃고샎", "?룫 吏곸옣", "?뫔 ?먮?", "?뱰 ?숈뾽", "?뮞 嫄닿컯"];
    const todayKey = new Date().toDateString();
    const interestKey = `v2_change_interest_${p.name}_${p.birthYear}_${Number(p.birthMonth)}_${Number(p.birthDay)}_${todayKey}`;
    const consumedKey = `${interestKey}_consumed`;
    const savedInterest = localStorage.getItem(interestKey);
    const wasAlreadyConsumed = localStorage.getItem(consumedKey) === "1";
    setPaidConsumedSnapshot(wasAlreadyConsumed);
    if (savedInterest && interestOptions.includes(savedInterest) && !wasAlreadyConsumed) {
      localStorage.setItem(consumedKey, "1");
    }
  }, [tier, result]);

  // 臾대즺??"?뱀떊??蹂??媛 "?ㅻ뒛 ?대? 諛쏆쑝?⑥뼱?? ?곹깭?몄?瑜??뚮뜑留?以묒뿉 留ㅻ쾲
  // localStorage?먯꽌 ?덈줈 ?쎌쑝硫? ?붾㈃??蹂댁뿬以 ???ㅻⅨ ?숈옉(?쎄린 ???쇰줈 ?ㅼ떆
  // ?뚮뜑留곷맆 ??移대뱶 ?댁슜???덈궡臾멸뎄濡?媛묒옄湲?諛붾뚯뼱 蹂댁씠??臾몄젣媛 ?덉뿀????  // ?붾㈃???대┫ ????踰덈쭔 ?뺤씤?댁꽌 洹?媛믪쓣 洹몃?濡??좎??섎룄濡?怨좎묠
  const [freeConsumedSnapshot, setFreeConsumedSnapshot] = useState<boolean | null>(null);
  useEffect(() => {
    const p = result?.profile;
    if (!p?.name || !p?.birthYear) return;
    if (tier !== "free") return;
    const todayKey = new Date().toDateString();
    const interestKey = `v2_change_interest_${p.name}_${p.birthYear}_${Number(p.birthMonth)}_${Number(p.birthDay)}_${todayKey}`;
    const consumedKey = `${interestKey}_consumed`;
    setFreeConsumedSnapshot(localStorage.getItem(consumedKey) === "1");
  }, [tier, result]);

  const goToPay = () => {
    if (selectedCats.length === 0) return;
    sessionStorage.setItem("v2_paid_cats", JSON.stringify(selectedCats));
    sessionStorage.setItem("v2_plan", "select");
    setShowSelect(false);
    router.push("/main-v2/payment");
  };

  const payInline = async () => {
    if (payBusy) return;
    setPayBusy(true);
    try {
      const profile = result?.profile;
      if (profile) {
        const category = selectedCats.length > 0 ? selectedCats[0] : "?뮥 ?щЪ??;
        const res = await fetch("/api/v2/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profile.name,
            birth: `${profile.birthYear}-${profile.birthMonth}-${profile.birthDay}`,
            birthHour: profile.birthHour,
            gender: profile.gender,
            relationship: profile.relationship,
            category,
            planType: "paid",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const histId = result?.histId ?? Date.now();
          const savedAt = result?.savedAt ?? new Date().toISOString();
          const newResult = { ...data, category, profile, histId, savedAt };
          sessionStorage.setItem("v2_result", JSON.stringify(newResult));
        }
      }
      sessionStorage.setItem("v2_paid", "1");
      sessionStorage.setItem("v2_plan", selPlan);
      sessionStorage.setItem("v2_paid_cats", JSON.stringify(selectedCats));
      if (profile?.name && profile?.birthYear) {
        const _d = new Date();
        const _tk = `${_d.getFullYear()}-${String(_d.getMonth()+1).padStart(2,"0")}-${String(_d.getDate()).padStart(2,"0")}`;
        localStorage.setItem(`v2_qa_unlock_${profile.name}_${profile.birthYear}`, _tk);
      }
      await new Promise(r => setTimeout(r, 1200));
      window.location.reload();
    } catch {
      setPayBusy(false);
      alert("寃곗젣 泥섎━ 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎. ?ㅼ떆 ?쒕룄?댁＜?몄슂.");
    }
  };

  const saveImage = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    // flushSync濡?利됱떆 DOM ?낅뜲?댄듃 ??saving=true媛 ??梨꾨줈 html2canvas ?ㅽ뻾
    flushSync(() => setSaving(true));
    try {
      const html2canvas = (await import("html2canvas")).default;
      const elements = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (elements.length === 0) { alert("??ν븷 ?댁슜???놁뒿?덈떎."); return; }
      if (window.innerWidth < 768) {
        const downloadCount = tier === "package" && elements.length > 1 ? elements.length - 1 : 1;
        alert(downloadCount > 1
          ? `?뱿 ?댁꽭 ${downloadCount}媛쒕? 媛곴컖 ?곕줈 ?ㅼ슫濡쒕뱶?댁빞 ?댁슂!\n\n?뺤씤李쎌씠 ?⑤㈃ [?ㅼ슫濡쒕뱶]瑜??꾨Ⅴ怨? "?ㅼ슫濡쒕뱶 ?꾨즺"媛 ?????ㅼ떆 [?ㅼ슫濡쒕뱶]瑜??뚮윭二쇱꽭??\n\n??踰덉뿉 ?щ윭 踰??꾨Ⅴ吏 留먭퀬 ?섎굹???쒖꽌?濡??뚮윭二쇱꽭?? 珥?${downloadCount}踰??꾨Ⅴ?쒕㈃ ?앸굹??\n\n?붾㈃???ㅼ슫濡쒕뱶 ?뚮┝??怨좎젙?섏뼱 ???덉뼱?? ?ㅼ슫濡쒕뱶 ???섎젮硫?[痍⑥냼] 踰꾪듉???꾨Ⅴ硫??쇱슂.`
          : "?뱿 ?좎떆 ??'?ㅼ슫濡쒕뱶' ?뺤씤李쎌씠 ?⑤㈃ [?ㅼ슫濡쒕뱶]瑜??뚮윭二쇱꽭??");
      }
      await document.fonts.ready;
      const isMobile = window.innerWidth < 768;
      const maxScrollHeight = Math.max(...elements.map(el => el.scrollHeight));
      const sharedScale = isMobile ? 1.5 : (maxScrollHeight > 6000 ? 1 : maxScrollHeight > 3000 ? 1.5 : 2);
      const canvases: HTMLCanvasElement[] = [];
      for (let elIdx = 0; elIdx < elements.length; elIdx++) {
        const el = elements[elIdx];
        const prevOv = el.style.overflow;
        const prevMH = el.style.maxHeight;
        const prevOvX = el.style.overflowX;
        el.style.overflow = "visible";
        el.style.overflowX = "hidden";
        el.style.maxHeight = "none";
        const captureBg = tier !== "package" ? "#ffffff" : (elIdx === 0 ? "#eab308" : "#fdf6e3");
        const c = await html2canvas(el, {
          backgroundColor: captureBg,
          scale: sharedScale,
          useCORS: true,
          allowTaint: true,
          logging: false,
          height: el.scrollHeight,
          windowWidth: isMobile ? window.innerWidth : 480,
          windowHeight: el.scrollHeight,
        });
        el.style.overflow = prevOv;
        el.style.overflowX = prevOvX;
        el.style.maxHeight = prevMH;
        canvases.push(c);
      }
      const MAX_CANVAS_HEIGHT = 14000; // 釉뚮씪?곗? 罹붾쾭???쒓퀎蹂대떎 ?ъ쑀 ?덇쾶 ?덉쟾?좎쓣 ??      const totalH = canvases.reduce((s, c) => s + c.height, 0) + (canvases.length - 1) * 16;

      const downloadCanvas = (canvas: HTMLCanvasElement, idx: number, total: number, label?: string) => {
        const link = document.createElement("a");
        const suffix = label ? `_${label}` : (total > 1 ? `_${idx + 1}of${total}` : "");
        link.download = `?먯슫_${result?.profile?.name ?? "?댁꽭"}_${new Date().toLocaleDateString("ko")}${suffix}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      };

      // 9900???댁긽 ?⑦궎吏(移댄뀒怨좊━ ?щ윭 媛????⑹퀜???섎굹??嫄곕???罹붾쾭?ㅻ? 留뚮뱾吏 ?딄퀬,
      // 移댄뀒怨좊━蹂꾨줈 媛곴컖 ?곕줈 ?????罹붾쾭???ш린 ?쒓퀎濡??명븳 ????ㅽ뙣瑜??먯쿇?곸쑝濡?以꾩엫
      // (?붿빟 移대뱶???곕줈 鍮쇱? ?딄퀬, 媛?移댄뀒怨좊━ ?대?吏 留??꾩뿉 ?④퍡 遺숈뿬??8??紐⑤몢???ㅼ뼱媛寃???
      if (tier === "package" && canvases.length > 1) {
        const pkgCats = (PKG_CAT_MAP[pkgName] ?? PKG_CAT_MAP["湲곕낯 遺꾩꽍"]).filter(c => allAnalyses[c.apiKey]);
        const summary = canvases[0];
        const failedLabels: string[] = [];
        canvases.slice(1).forEach((c, i) => {
          const label = pkgCats[i]?.label ?? `?ъ＜${i + 1}`;
          try {
            // ?붿빟 移대뱶 + ?대떦 移댄뀒怨좊━ 移대뱶瑜??꾩븘?섎줈 ?댁뼱遺숈씤 ??罹붾쾭?ㅻ? 留뚮뱾?????
            // ?뱀젙 移댄뀒怨좊━(?? 嫄닿컯?? ?댁슜???좊궃??湲몃㈃ ?⑹튇 ?믪씠媛 釉뚮씪?곗? 罹붾쾭??            // ?쒓퀎瑜??섏뼱 議곗슜???ㅽ뙣(鍮??대?吏/?ㅼ슫濡쒕뱶 ?꾨씫)?????덉뼱?? ?쒓퀎瑜?            // ?섏쑝硫?鍮꾩쑉???좎???梨?以꾩뿬?쒕씪???덉쟾?섍쾶 ??λ릺?꾨줉 ??            const rawHeight = summary.height + 16 + c.height;
            const scale = rawHeight > MAX_CANVAS_HEIGHT ? MAX_CANVAS_HEIGHT / rawHeight : 1;
            const merged = document.createElement("canvas");
            merged.width = Math.round(Math.max(summary.width, c.width) * scale);
            merged.height = Math.round(rawHeight * scale);
            const ctx = merged.getContext("2d")!;
            ctx.fillStyle = "#fdf6e3";
            ctx.fillRect(0, 0, merged.width, merged.height);
            ctx.drawImage(summary, 0, 0, summary.width * scale, summary.height * scale);
            ctx.drawImage(c, 0, (summary.height + 16) * scale, c.width * scale, c.height * scale);
            downloadCanvas(merged, i, canvases.length - 1, label);
          } catch (e) {
            console.error(`?대?吏 ????ㅽ뙣(${label}):`, e);
            failedLabels.push(label);
          }
        });
        if (failedLabels.length > 0) alert(`?ㅼ쓬 ??ぉ? ?대?吏 ??μ뿉 ?ㅽ뙣?덉뒿?덈떎: ${failedLabels.join(", ")}`);
        else setTimeout(() => alert(`??${window.innerWidth < 768 ? "?ъ쭊 ??媛ㅻ윭由?" : "?ㅼ슫濡쒕뱶 ?대뜑"}????λ릱?댁슂!`), 0);
        return;
      }

      if (totalH <= MAX_CANVAS_HEIGHT) {
        const merged = document.createElement("canvas");
        merged.width = canvases[0].width;
        merged.height = totalH;
        const ctx = merged.getContext("2d")!;
        ctx.fillStyle = tier === "package" ? "#f5f3ff" : "#fdf2f8";
        ctx.fillRect(0, 0, merged.width, merged.height);
        let y = 0;
        for (let i = 0; i < canvases.length; i++) {
          ctx.drawImage(canvases[i], 0, y);
          y += canvases[i].height + 16;
        }
        downloadCanvas(merged, 0, 1);
      } else {
        // ?댁슜??湲몄뼱 ???μ뿉 ??紐??댁쑝硫? ?덉쟾???ш린濡??섎닠???щ윭 ?μ쑝濡????        const groups: HTMLCanvasElement[][] = [];
        let cur: HTMLCanvasElement[] = [];
        let curH = 0;
        for (const c of canvases) {
          if (curH + c.height > MAX_CANVAS_HEIGHT && cur.length > 0) {
            groups.push(cur);
            cur = [];
            curH = 0;
          }
          cur.push(c);
          curH += c.height + 16;
        }
        if (cur.length > 0) groups.push(cur);

        groups.forEach((group, gi) => {
          // 泥??μ? ?대? 釉뚮옖??移대뱶(?맩 ?먯슫)媛 留??꾩뿉 ?덉쑝誘濡? 2踰덉㎏ ?λ??곕뒗
          // ?대뒓 移댄뀒怨좊━???섎━吏 ?딄퀬 ?쒖옉?섎뒗 寃껉낵 蹂꾧컻濡??곷떒??釉뚮옖???ㅻ뜑瑜?吏곸젒 洹몃젮 ?ｌ쓬
          const needsHeader = gi > 0;
          const headerH = needsHeader ? 80 * window.devicePixelRatio : 0;
          const gH = group.reduce((s, c) => s + c.height, 0) + (group.length - 1) * 16 + headerH;
          const merged = document.createElement("canvas");
          merged.width = group[0].width;
          merged.height = gH;
          const ctx = merged.getContext("2d")!;
          ctx.fillStyle = tier === "package" ? "#f5f3ff" : "#fdf2f8";
          ctx.fillRect(0, 0, merged.width, merged.height);
          let y = 0;
          if (needsHeader) {
            const dpr = window.devicePixelRatio;
            ctx.fillStyle = tier === "package" ? "#2c4a73" : "#ec4899";
            ctx.fillRect(0, 0, merged.width, headerH);
            ctx.fillStyle = "#ffffff";
            ctx.font = `900 ${22 * dpr}px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`?맩 ${brand?.businessName || "?먯슫"} 쨌 AI ?ъ＜ 遺꾩꽍 (${gi + 1}/${groups.length})`, merged.width / 2, headerH / 2);
            y = headerH;
          }
          for (const c of group) {
            ctx.drawImage(c, 0, y);
            y += c.height + 16;
          }
          downloadCanvas(merged, gi, groups.length);
        });
      }
      setTimeout(() => alert(`??${window.innerWidth < 768 ? "?ъ쭊 ??媛ㅻ윭由?" : "?ㅼ슫濡쒕뱶 ?대뜑"}????λ릱?댁슂!`), 0);
    } catch (e) {
      console.error("?대?吏 ????ㅽ뙣:", e);
      alert("?대?吏 ??μ뿉 ?ㅽ뙣?덉뒿?덈떎. ?ㅽ겕由곗꺑???댁슜?댁＜?몄슂.");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const share = async () => {
    if (!result) return;
    let url = window.location.origin + "/main-v2";
    let extra = "";
    if (tier === "package" && result.profile?.birthYear) {
      const ganList = ["媛?,"??,"蹂?,"??,"臾?,"湲?,"寃?,"??,"??,"怨?];
      const y = Number(result.profile.birthYear);
      const gan = ganList[((y - 4) % 10 + 10) % 10];
      extra = `\n${gan} 泥쒓컙???怨좊궃 ?ъ＜ ?ъ링 遺꾩꽍 寃곌낵?덉슂 ?が`;
    }
    // 怨듭쑀諛쏆? ?щ엺???ㅻⅨ ?대???釉뚮씪?곗?) ?ㅼ젣 寃곌낵瑜?蹂????덇쾶, 怨듭쑀?섎뒗
    // ?쒓컙 蹂댁씠???댁슜???쒕쾭????ν븯怨?洹?怨좎쑀 二쇱냼瑜?怨듭쑀??????μ씠
    // ?ㅽ뙣?대룄 怨듭쑀 ?먯껜??留됱? ?딄퀬 洹몃깷 硫붿씤 二쇱냼濡??泥댄븿
    try {
      // ?붾㈃??蹂댁씠??移댄뀒怨좊━蹂????꾩씠肄섍퉴吏 洹몃?濡??대젮??怨듭쑀蹂몃룄 ?묎컳??援щ텇?섏뼱 蹂댁씠寃???      const categories =
        tier === "free" ? [{ icon: "?뙚", label: "?ㅻ뒛???댁꽭", color: "#f59e0b", text: freeAnalysis }]
        : tier === "select" ? ALL_SCORE_CATS.filter(c => c.key !== FREE_CAT && paidCats.includes(c.key))
            .map(c => ({ icon: c.icon, label: c.key.replace(/\S+\s/, ""), color: c.color, text: allAnalyses[c.key], badge: "?뭿 ?ъ링" }))
        : (PKG_CAT_MAP[pkgName] ?? PKG_CAT_MAP["湲곕낯 遺꾩꽍"])
            .filter(c => allAnalyses[c.apiKey])
            .map(c => ({ icon: c.icon, label: c.label, color: c.color, text: allAnalyses[c.apiKey], badge: "?벀 ?⑦궎吏" }));
      const validCategories = categories.filter(c => c.text && c.text.trim());
      if (validCategories.length > 0) {
        const res = await fetch("/api/v2/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: result.profile?.name,
            scores: result.scores, luckyColor: result.luckyColor, luckyNumber: result.luckyNumber, luckyDirection: result.luckyDirection,
            categories: validCategories, tier,
            // "?앸뀈?붿씪 ?뺣낫 怨듦컻"瑜?爰쇰몢硫?birthYear瑜???蹂대궡?? 怨듭쑀諛쏆? ?щ엺?쒗뀒
            // ?졖룹삤??誘몃━蹂닿린(?앸뀈?붿씪 湲곕컲 ?뺣낫)媛 ??蹂댁씠怨??대쫫+遺꾩꽍湲留?蹂댁엫
            birthYear: shareIncludeBirth ? result.profile?.birthYear : undefined,
            // ?뚰듃???쒕툕?꾨찓?몄뿉??怨듭쑀???뚮쭔 businessName???ㅼ뼱 蹂대궡??
            // KakaoShareClient?먯꽌 ?뚰듃??怨듭쑀?꾩쓣 媛먯???踰꾪듉???④린寃???            // isPartner(?쒕툕?꾨찓??利됱떆 ?먮떒)瑜?1李⑤줈 ?곌퀬, brand API媛 ?깃났?덉쑝硫??ㅼ젣 ?곹샇紐??곗꽑
            businessName: isPartner ? (brand?.businessName || "partner") : undefined,
          }),
        });
        if (res.ok) { const data = await res.json(); url = `${window.location.origin}/main-v2/share-kakao/${data.id}`; }
      }
    } catch {}
    const kakao = (window as any).Kakao;
    if (kakao && !kakao.isInitialized()) {
      try { kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY); } catch {}
    }
    const kakaoReady = kakao && kakao.isInitialized() && kakao.Share;
    const isPartnerShare = !!brand?.businessName;
    const text = isPartnerShare
      ? `${result.profile?.name}?섏쓽 ?댁꽭 遺꾩꽍 ?뵰\n珥앹슫 ${result.scores?.total}??{extra}`
      : `${result.profile?.name}?섏쓽 ?댁꽭 遺꾩꽍 ?뵰\n珥앹슫 ${result.scores?.total}??{extra}\n\n?벑 ?섎룄 臾대즺濡? jeomun.com`;
    if (kakaoReady && url) {
      try {
        kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: `?뵰 ${result.profile?.name}?섏쓽 ?ъ＜ 遺꾩꽍 寃곌낵`,
            description: isPartnerShare
              ? `珥앹슫 ${result.scores?.total}?? AI ?ъ＜ 遺꾩꽍 寃곌낵`
              : `珥앹슫 ${result.scores?.total}?? ?뮥 990??AI?ъ＜ ?먯슫 jeomun.com`,
            imageUrl: "https://i.pinimg.com/1200x/21/92/2c/21922cc59f29ba66e12cc4546e316079.jpg",
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: isPartnerShare
            ? [{ title: "???ъ＜ 寃곌낵 蹂닿린", link: { mobileWebUrl: url, webUrl: url } }]
            : [
                { title: "???ъ＜ 寃곌낵 蹂닿린", link: { mobileWebUrl: url, webUrl: url } },
                { title: "?섎룄 臾대즺濡??ъ＜ 蹂닿린", link: { mobileWebUrl: "https://jeomun.com/main-v2", webUrl: "https://jeomun.com/main-v2" } },
              ],
        });
      } catch {
        navigator.clipboard.writeText(`${text}\n${url}`).then(() => alert("??留곹겕媛 蹂듭궗?섏뿀?듬땲??"));
      }
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`).then(() => alert("??留곹겕媛 蹂듭궗?섏뿀?듬땲??"));
    }
  };

  if (!result) return null;

  const { scores, luckyColor, luckyNumber, luckyDirection, profile } = result;
  const freeAnalysis: string = result.analysis ?? "";

  // 寃곌낵 ?쎌뼱二쇨린 ??釉뚮씪?곗? ?댁옣 ?뚯꽦?⑹꽦(Web Speech API)?대씪 蹂꾨룄 鍮꾩슜/?ㅼ튂 ?놁쓬.
  // 湲?湲????踰덉뿉 ?쏀엳硫??쇰? 釉뚮씪?곗?(?뱁엳 ?щ＼)?먯꽌 以묎컙???딄린??寃쎌슦媛
  // ?덉뼱?? 臾몄옣 ?⑥쐞濡??섎씪 李⑤?濡??쎄쾶 ???딄꺼???ㅼ쓬 臾몄옣遺???댁뼱吏?.
  // 硫덉텣 ?꾩튂??readChunksRef/readIdxRef????ν빐?먭퀬, 媛숈? ?붾㈃?먯꽌 ?ㅼ떆
  // ?꾨Ⅴ硫?洹??꾩튂遺???댁뼱???쎌쓬 ???붾㈃??踰쀬뼱?섎㈃ 而댄룷?뚰듃媛 ?ㅼ떆 留덉슫??  // ?섎㈃????媛믩뱾??珥덇린?붾릺誘濡? ?ъ쭊???쒖뿏 ?먯뿰??泥섏쓬遺???쏀옒
  // ?쇰? 湲곌린(?뱁엳 ?덈뱶濡쒖씠?????뚯꽦 紐⑸줉??鍮꾨룞湲곕줈 ??쾶 濡쒕뱶?섏뼱, 洹??꾩뿉
  // speak()瑜??몄텧?섎㈃ ?먮윭???놁씠 洹몃깷 ?뚮━媛 ???섎뒗 寃쎌슦媛 ?덉쓬 ??紐⑸줉??  // 梨꾩썙吏湲??좉퉸 湲곕떎?몃떎媛(理쒕? 1珥? ?쒓뎅???뚯꽦??李얠븘??紐낆떆?곸쑝濡?吏?뺥븿
  const getKoreanVoice = (): Promise<SpeechSynthesisVoice | null> => {
    return new Promise(resolve => {
      const pick = (list: SpeechSynthesisVoice[]) => list.find(v => v.lang?.toLowerCase().startsWith("ko")) || null;
      const existing = window.speechSynthesis.getVoices();
      if (existing.length > 0) { resolve(pick(existing)); return; }
      const timer = setTimeout(() => resolve(pick(window.speechSynthesis.getVoices())), 1000);
      window.speechSynthesis.onvoiceschanged = () => {
        clearTimeout(timer);
        resolve(pick(window.speechSynthesis.getVoices()));
      };
    });
  };

  // ?붾㈃??爰쇱?嫄곕굹 ?곌껐 ?먮윭濡??섏씠吏媛 ?ㅼ떆 留덉슫?몃릺硫?readChunksRef/readIdxRef??  // 硫붾え由ъ뿉 ?덈뜕 媛믪씠???щ씪吏???localStorage??媛숈씠 ??ν빐?먮㈃, ?ㅼ떆 ?ㅼ뼱?붿쓣 ??  // 泥섏쓬遺?곌? ?꾨땲??硫덉톬???꾩튂遺???댁뼱???쎌쓣 ???덉쓬. sessionStorage??紐⑤컮?쇱뿉??  // ?붾㈃??爰쇱졇 釉뚮씪?곗?媛 ??쓣 ?듭㎏濡??덈줈 留뚮뱾硫??몄뀡???앸궓) 媛숈씠 ?щ씪吏??寃쎌슦媛
  // ?덉뼱?? ?몄뀡 寃쎄퀎? 臾닿??섍쾶 ?⑥븘?덈뒗 localStorage濡???ν븿
  // 怨좎젙?????섎굹留??곕㈃, ?덈줈???ъ＜瑜?蹂닿퀬 ?쎄린瑜??뚮??????댁쟾 ?щ엺??硫덉텣
  // ?꾩튂媛 ?⑥븘?덉뼱??洹??댁슜??洹몃?濡??댁뼱 ?쏀엳???ш컖??臾몄젣媛 ?덉뿀???꾩쟾??  // ?ㅻⅨ ?щ엺?몃뜲 ??湲???쏀옒) ??result.histId(遺꾩꽍留덈떎 ?앷린??怨좎쑀 踰덊샇)瑜?  // ?ㅼ뿉 ?ы븿?쒖폒?? ?ㅻⅨ 遺꾩꽍?대㈃ ?덈? 媛숈? ?ㅻ? ?곗? ?딄쾶 ??  const ttsProgressKey = `v2_tts_progress_${result?.histId ?? ""}`;
  const saveTtsProgress = (chunks: string[], idx: number) => {
    try { localStorage.setItem(ttsProgressKey, JSON.stringify({ chunks, idx })); } catch {}
  };
  const clearTtsProgress = () => {
    try { localStorage.removeItem(ttsProgressKey); } catch {}
  };

  const speakFrom = async (chunks: string[], startIdx: number) => {
    const voice = await getKoreanVoice();
    chunks.slice(startIdx).forEach((chunk, i) => {
      const idx = startIdx + i;
      const utter = new SpeechSynthesisUtterance(chunk);
      utter.lang = "ko-KR";
      if (voice) utter.voice = voice;
      utter.rate = 1;
      utter.onstart = () => { readIdxRef.current = idx; saveTtsProgress(chunks, idx); };
      utter.onerror = (e) => {
        if (e.error === "canceled" || e.error === "interrupted") {
          // restartReadAloud媛 cancel()???몄텧??寃쎌슦 speaking??false濡?諛붽씀硫???????          // 洹?吏곹썑 setSpeaking(true)瑜??대룄 ??肄쒕갚??鍮꾨룞湲곕줈 ??쾶 ??뼱?⑤쾭?ㅼ꽌
          // 踰꾪듉??"硫덉텛湲?媛 ?꾨땶 "?쎄린"濡?怨좎젙?섎뒗 踰꾧렇媛 ?덉뿀??          if (!restartingRef.current) setSpeaking(false);
          return;
        }
        setSpeaking(false);
        readChunksRef.current = [];
        readIdxRef.current = 0;
        // 吏꾩쭨 ?ㅽ뙣???뚮뒗 ?대? ?湲곗뿴???ㅼ뼱媛 ?덈뒗 ?섎㉧吏 臾몄옣?ㅻ룄 ?꾨?
        // 硫덉떠????????洹몃윭硫?"硫덉텛湲?瑜??뚮윭??怨꾩냽 ?쏀엳??寃껋쿂??蹂댁엫
        window.speechSynthesis.cancel();
        releaseWakeLock();
        // 吏꾩쭨 ?먮윭?щ룄 硫덉텣 ?꾩튂(sessionStorage)??吏?곗? ?딆쓬 ??湲곌린 臾몄젣濡?        // ??踰??딄꼈?ㅺ? ?ㅼ떆 ?ㅼ뼱???洹??꾩튂遺???댁뼱???쎌쓣 ???덇쾶 ??        alert("?쎌뼱二쇨린媛 ?딄꼈?댁슂. ?붾㈃???먮룞?쇰줈 爰쇱?硫댁꽌 ?딄린??寃쎌슦媛 留롮븘??\n?대????ㅼ젙 > ?붿뒪?뚮젅??> ?붾㈃ ?먮룞 爰쇱쭚 ?쒓컙???섎━嫄곕굹, '蹂닿퀬 ?덈뒗 ?숈븞 ?붾㈃ 耳쒖쭚' 湲곕뒫??耳쒕몢硫??딄린吏 ?딆븘??");
      };
      if (idx === chunks.length - 1) {
        utter.onend = () => {
          setSpeaking(false);
          readIdxRef.current = 0;
          readChunksRef.current = [];
          clearTtsProgress();
          releaseWakeLock();
        };
      }
      window.speechSynthesis.speak(utter);
    });
  };

  // ?붾㈃??爰쇱죱??耳쒖죱????"speaking ?곹깭??true?몃뜲 ?ㅼ젣 ?뚯꽦? 硫덉떠?덈뒗" 寃쎌슦瑜?  // 媛먯??댁꽌 硫덉톬???꾩튂(readIdxRef)遺???먮룞?쇰줈 ?ㅼ떆 ?쎄린 ?쒖옉??
  // window.speechSynthesis.speaking? 紐⑤컮??釉뚮씪?곗??먯꽌 ?붾㈃??爰쇱죱??耳쒖쭊 ??  // ?ㅼ젣濡쒕뒗 硫덉톬?붾뜲??true濡?怨좎젙?섏뼱踰꾨━???뚮젮吏?踰꾧렇媛 ?덉뼱?? ??媛믪?
  // ?좊ː?섏? ?딄퀬 ?곕━媛 吏곸젒 愿由ы븯??speaking ?곹깭留?湲곗??쇰줈 媛뺤젣濡??ㅼ떆 ?쒖옉??  resumeAfterHideRef.current = () => {
    if (speaking && readChunksRef.current.length > 0 && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      requestWakeLock();
      speakFrom(readChunksRef.current, readIdxRef.current);
    }
  };

  const toggleReadAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("移댁뭅?ㅽ넚 ?????덉뿉?쒕뒗 ?붾㈃ ?ㅻⅨ履??꾨옒 ????媛??? 踰꾪듉???꾨Ⅴ怨?[?ㅻⅨ 釉뚮씪?곗?濡??닿린]瑜??좏깮???ㅼ쓬 ?쎄린瑜??꾨Ⅴ硫??쎌뼱二쇨린 湲곕뒫???묐룞?⑸땲??\n\n洹몃옒?????섎㈃, ????媛??? 踰꾪듉???꾨Ⅴ怨?[?ㅻⅨ ?깆쑝濡?怨듭쑀] ??[Chrome]???좏깮?댁꽌 ?ㅼ뼱媛??ㅼ쓬 ?쎄린瑜??뚮윭蹂댁꽭??\n\n?뮕 ?쎈뒗 以묎컙???붾㈃??爰쇱?硫??딄만 ???덉뼱?? ?대????ㅼ젙 > ?붿뒪?뚮젅??> ?붾㈃ ?먮룞 爰쇱쭚 ?쒓컙???섎━嫄곕굹, '蹂닿퀬 ?덈뒗 ?숈븞 ?붾㈃ 耳쒖쭚' 湲곕뒫??耳쒕몢硫??딄린吏 ?딆븘??");
      return;
    }
    // window.speechSynthesis.speaking? 湲곌린???곕씪 ?ㅼ젣 ?곹깭? ?ㅻⅤ寃?硫덉톬?붾뜲??    // true濡? ?섏삤??寃쎌슦媛 ?덉뼱?? ??媛믪쑝濡?"?뺤? vs ?댁뼱?쎄린"瑜??먮떒?섎㈃ 硫덉텛湲?    // 踰꾪듉??癒뱁넻???섎뒗 臾몄젣媛 ?덉뿀?????곕━媛 吏곸젒 愿由ы븯??speaking ?곹깭留?蹂닿퀬
    // 臾댁“嫄?硫덉땄(?붾㈃爰쇱쭚?쇰줈 ?딄릿 寃쎌슦???먮룞 ?댁뼱?쎄린??resumeAfterHideRef媛 ?곕줈 泥섎━)
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      releaseWakeLock();
      return;
    }
    // ?쎄린瑜??쒖옉?섍린 ?꾩뿉, ?붾㈃???먮룞?쇰줈 爰쇱?硫??딄만 ???덈떎??嫄?誘몃━ ??踰?    // ?덈궡???딄릿 ?ㅼ뿉 ?뚮젮二쇰뒗 寃껊낫??誘몃━ ?ㅼ젙?대몢寃??섎뒗 寃??섏쓬). ?섎（ ??踰덈쭔
    // ?붾㈃ ?먮룞爰쇱쭚 ?덈궡??紐⑤컮?쇱뿉?쒕쭔 ?섎?媛 ?덉쑝誘濡?PC?먯꽌???꾩슦吏 ?딆쓬
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const ttsTipKey = "v2_tts_tip_shown_date";
    if (isMobileDevice && localStorage.getItem(ttsTipKey) !== new Date().toDateString()) {
      alert("?뮕 ?쎈뒗 以묎컙???붾㈃??爰쇱?硫??딄만 ???덉뼱??\n?대????ㅼ젙 > ?붿뒪?뚮젅??> ?붾㈃ ?먮룞 爰쇱쭚 ?쒓컙???섎━嫄곕굹, '蹂닿퀬 ?덈뒗 ?숈븞 ?붾㈃ 耳쒖쭚' 湲곕뒫??耳쒕몢硫??딄린吏 ?딆븘??");
      localStorage.setItem(ttsTipKey, new Date().toDateString());
    }
    if (readChunksRef.current.length === 0) {
      // ?붾㈃??爰쇱?嫄곕굹 ?먮윭濡??ㅼ떆 ?ㅼ뼱??寃쎌슦, ?댁쟾??硫덉톬???꾩튂媛
      // sessionStorage???⑥븘?덉쑝硫?泥섏쓬遺???ㅼ떆 留뚮뱾吏 留먭퀬 洹??꾩튂遺???댁뼱read
      try {
        const saved = localStorage.getItem(ttsProgressKey);
        if (saved) {
          const { chunks, idx } = JSON.parse(saved);
          if (Array.isArray(chunks) && chunks.length > 0 && typeof idx === "number") {
            readChunksRef.current = chunks;
            readIdxRef.current = idx;
          }
        }
      } catch {}
    }
    if (readChunksRef.current.length === 0) {
      // ?붾㈃???ㅼ젣濡?蹂댁씠???댁슜留??뺥솗???쎄쾶 ????allAnalyses ?덉뿉??"?ㅻ뒛??      // ?댁꽭"(誘몃━蹂닿린?? 寃곗젣 ?붾㈃????蹂댁엫) ??ぉ??媛숈씠 ?욎뿬?덉뼱?? 洹멸구 洹몃?濡?      // ???쎌쑝硫?寃곗젣??吏꾩쭨 ?댁슜 ???"?ㅻ뒛???댁꽭"留?怨꾩냽 ?쏀엳??臾몄젣媛 ?덉뿀??      const visibleTexts =
        tier === "free" ? [freeAnalysis]
        : tier === "select" ? ALL_SCORE_CATS.filter(c => c.key !== FREE_CAT && paidCats.includes(c.key)).map(c => allAnalyses[c.key])
        : (PKG_CAT_MAP[pkgName] ?? PKG_CAT_MAP["湲곕낯 遺꾩꽍"]).filter(c => allAnalyses[c.apiKey]).map(c => allAnalyses[c.apiKey]);

      // "?뱀떊??蹂?? 移대뱶???붾㈃???ㅼ젣濡?蹂댁씠??留뚰겮留??쎌쓬 ??臾대즺?먯꽌 ?꾩쭅
      // 寃곗젣 ?????곹깭硫?釉붾윭 泥섎━??hidden2(990??寃곗젣 ??怨듦컻)???덈? ?쎌?
      // ?딆쓬(?붾㈃ ?뚮뜑留곴낵 ?묎컳? 議곌굔??洹몃?濡??ㅼ떆 ?뺤씤?댁꽌 媛?몄샂). ?뚰듃??      // ?쒕툕?꾨찓?몄뿉?쒕뒗 ???뱀뀡 ?먯껜瑜??붾㈃????蹂댁뿬二쇰?濡??쎄린?먯꽌???쒖쇅
      if (!isPartner && profile?.name && profile?.birthYear) {
        const interestOptions = ["?뮥 ??, "?뮆 ?좎젙", "?렞 ?깃났", "?뮳 ?ъ뾽", "?뭾 寃고샎", "?룫 吏곸옣", "?뫔 ?먮?", "?뱰 ?숈뾽", "?뮞 嫄닿컯"];
        const todayKey = new Date().toDateString();
        const interestKey = `v2_change_interest_${profile.name}_${profile.birthYear}_${Number(profile.birthMonth)}_${Number(profile.birthDay)}_${todayKey}`;
        const savedInterestToday = typeof window !== "undefined" ? localStorage.getItem(interestKey) : null;
        if (tier === "free") {
          const directInterest = changeInterest ?? (savedInterestToday && interestOptions.includes(savedInterestToday) ? savedInterestToday : null);
          if (freeConsumedSnapshot !== true && directInterest) {
            const yc = getYourChangeType(profile.name, profile.birthYear, profile.birthMonth, profile.birthDay, undefined, directInterest);
            visibleTexts.push(`${yc.title}. ${yc.insight} ${yc.hidden1}`); // hidden2??990??寃곗젣 ?꾩씠?????쎌쓬
          }
        } else if (paidConsumedSnapshot !== true && savedInterestToday && interestOptions.includes(savedInterestToday)) {
          const yc = getYourChangeType(profile.name, profile.birthYear, profile.birthMonth, profile.birthDay, undefined, savedInterestToday);
          visibleTexts.push(`${yc.title}. ${yc.insight} ${yc.hidden1} ${yc.hidden2}`); // 寃곗젣 ???꾩껜怨듦컻?????쎌쓬
        }
      }
      // ?대え吏???뚯꽦?⑹꽦湲곌? "諛섏쭩?대뒗 蹂? 媛숈? ?ㅻ챸?쇰줈 ?쎌뼱踰꾨젮???쒓굅?섍퀬,
      // "9~12???대굹 "06??12??泥섎읆 ?レ옄 ?ъ씠??臾쇨껐??~)媛 ?덉쑝硫?洹멸구 "臾쇨껐"
      // ?대씪怨?洹몃?濡??쎌뼱踰꾨젮??"9?붿뿉??12??/"06?쒖뿉??12??泥섎읆 ?먯뿰?ㅻ읇寃?      // ?쏀엳?꾨줉 誘몃━ 諛붽퓭???붾㈃ ?쒖떆??洹몃?濡? ?뚯꽦?쇰줈留??ㅼ뼱媛???띿뒪?몃쭔 蹂??.
      // ?レ옄? 臾닿???~??嫄대뱶由ъ? ?딆쓬
      const fullText = visibleTexts.filter(Boolean).join("\n")
        .replace(/(\d+)\s*~\s*(\d+)\s*(????????遺?珥???踰?媛???/g, "$1$3?먯꽌 $2$3")
        .replace(/(\d+[媛-??{0,2})\s*~\s*(?=\d)/g, "$1?먯꽌 ")
        .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{25A0}-\u{25FF}\u{FE0F}]/gu, "")
        // ?쒓? ?⑥뼱 ???쒖옄 愿꾪샇(?? "?묎린(?썸간)")???뚯꽦?⑹꽦湲곌? ?쒓?怨??쒖옄瑜?        // ?????쎌뼱??"?묎린 ?묎린"泥섎읆 以묐났?쇰줈 ?ㅻ━誘濡? 愿꾪샇 ???쒖옄???듭㎏濡??쒓굅
        // (?꾧컖 愿꾪샇 竊덌펹 ??媛숈씠 泥섎━)
        .replace(/[竊?][訝-涌?+[竊?]/g, "")
        // 諛섎?濡??쒖옄 ?ㅼ뿉 ?쒓? 諛쒖쓬 愿꾪샇(?? "麗???")媛 ?ㅻ뒗 寃쎌슦???묎컳??        // 以묐났?쇰줈 ?쏀엳誘濡? ?욎쓽 ?쒖옄??鍮쇨퀬 愿꾪샇 ???쒓? 諛쒖쓬留??④?
        .replace(/[訝-涌?+[竊?]([媛-??+)[竊?]/g, "$1")
        // 湲 以묎컙??횞??"怨깊븯湲?濡??쏀????댁깋?섎?濡? ?섏뿴 ?섎???"?"濡?諛붽퓭???쎌쓬
        .replace(/횞/g, " ? ");
      if (!fullText.trim()) return;
      readChunksRef.current = fullText.split(/(?<=[.!???n])\s*/).map(s => s.trim()).filter(Boolean);
      readIdxRef.current = 0;
    }
    window.speechSynthesis.cancel();
    requestWakeLock();
    speakFrom(readChunksRef.current, readIdxRef.current);
    setSpeaking(true);
  };

  const restartReadAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    restartingRef.current = true;
    window.speechSynthesis.cancel();
    clearTtsProgress();
    const visibleTexts =
      tier === "free" ? [freeAnalysis]
      : tier === "select" ? ALL_SCORE_CATS.filter(c => c.key !== FREE_CAT && paidCats.includes(c.key)).map(c => allAnalyses[c.key])
      : (PKG_CAT_MAP[pkgName] ?? PKG_CAT_MAP["湲곕낯 遺꾩꽍"]).filter(c => allAnalyses[c.apiKey]).map(c => allAnalyses[c.apiKey]);
    if (!isPartner && profile?.name && profile?.birthYear) {
      const interestOptions = ["?뮥 ??, "?뮆 ?좎젙", "?렞 ?깃났", "?뮳 ?ъ뾽", "?뭾 寃고샎", "?룫 吏곸옣", "?뫔 ?먮?", "?뱰 ?숈뾽", "?뮞 嫄닿컯"];
      const todayKey = new Date().toDateString();
      const interestKey = `v2_change_interest_${profile.name}_${profile.birthYear}_${Number(profile.birthMonth)}_${Number(profile.birthDay)}_${todayKey}`;
      const savedInterestToday = localStorage.getItem(interestKey);
      if (tier === "free") {
        const directInterest = changeInterest ?? (savedInterestToday && interestOptions.includes(savedInterestToday) ? savedInterestToday : null);
        if (freeConsumedSnapshot !== true && directInterest) {
          const yc = getYourChangeType(profile.name, profile.birthYear, profile.birthMonth, profile.birthDay, undefined, directInterest);
          visibleTexts.push(`${yc.title}. ${yc.insight} ${yc.hidden1}`);
        }
      } else if (paidConsumedSnapshot !== true && savedInterestToday && interestOptions.includes(savedInterestToday)) {
        const yc = getYourChangeType(profile.name, profile.birthYear, profile.birthMonth, profile.birthDay, undefined, savedInterestToday);
        visibleTexts.push(`${yc.title}. ${yc.insight} ${yc.hidden1} ${yc.hidden2}`);
      }
    }
    const fullText = visibleTexts.filter(Boolean).join("\n")
      .replace(/(\d+)\s*~\s*(\d+)\s*(????????遺?珥???踰?媛???/g, "$1$3?먯꽌 $2$3")
      .replace(/(\d+[媛-??{0,2})\s*~\s*(?=\d)/g, "$1?먯꽌 ")
      .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{25A0}-\u{25FF}\u{FE0F}]/gu, "")
      .replace(/[竊?][訝-涌?+[竊?]/g, "")
      .replace(/[訝-涌?+[竊?]([媛-??+)[竊?]/g, "$1")
      .replace(/횞/g, " ? ");
    if (!fullText.trim()) return;
    readChunksRef.current = fullText.split(/(?<=[.!???n])\s*/).map(s => s.trim()).filter(Boolean);
    readIdxRef.current = 0;
    requestWakeLock();
    speakFrom(readChunksRef.current, 0);
    setSpeaking(true);
    setTimeout(() => { restartingRef.current = false; }, 300);
  };

  return (
    <>
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        const kakao = (window as any).Kakao;
        if (kakao && !kakao.isInitialized()) kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      }}
    />
    <main style={{ minHeight: "100vh", backgroundImage: `url('${tier === "package" ? "https://i.pinimg.com/736x/27/8b/de/278bde2d39a789d716ab0a1718413838.jpg" : "https://i.pinimg.com/1200x/ec/80/41/ec8041c9802a98ff6423c34a1ae44f38.jpg"}'), ${BG}`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      {/* 寃곌낵 ?쎌뼱二쇨린 ???대뵒濡??ㅽ겕濡ㅽ븯????긽 ?꾨? ???덇쾶 怨좎젙 */}
      <div style={{ position: "fixed", right: 16, bottom: 24, zIndex: 200, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        <button onClick={restartReadAloud} title="泥섏쓬遺???ㅼ떆 ?ｊ린" style={{ padding: "8px 12px", borderRadius: 50, border: "none", background: "rgba(139,92,246,0.15)", color: "#8b5cf6", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>??泥섏쓬遺???ｊ린</button>
        <button onClick={toggleReadAloud}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 50, border: "none", background: speaking ? "linear-gradient(135deg, #ef4444, #f97316)" : G, color: "white", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}>
          {speaking ? "??硫덉텛湲? : "?뵄 ?쎌뼱二쇨린"}
        </button>
      </div>

      {/* ?ㅻ뜑 */}
      <header style={{ minHeight: 52, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", rowGap: 6, columnGap: 6, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", flexShrink: 0 }}>
          <span style={{ fontSize: 18 }}>??/span>
          <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap" }}>{brand?.businessName ? `?맩 ${brand.businessName}` : "?맩 ?먯슫"}</span>
        </button>
        <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
          {paid && (
          <button onClick={() => router.push("/main-v2/history")} style={{ padding: "5px 12px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.25)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>
            ?뱛 蹂닿???          </button>
          )}
          <button onClick={() => setShowShareModal(true)} style={{ padding: "5px 12px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>
            ?벑 怨듭쑀
          </button>
          {paid && (
            <button onClick={saveImage} disabled={saving} style={{ padding: "5px 12px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: saving ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
              {saving ? "??.." : "?뼹截????}
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* ?? ?ъ＜ Q&A 踰꾪듉 (?대┃ ??Q&A ?섏씠吏濡??대룞) ?? */}
        {!isPartner && profile?.name && profile?.birthYear && (
          <button
            onClick={() => {
              sessionStorage.setItem("v2_plan", paid ? "select" : "free");
              router.push("/main-v2/qa-list");
            }}
            style={{ width: "100%", padding: "14px 20px", marginBottom: 16, background: "linear-gradient(135deg, #1a0635, #3b0764)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(139,92,246,0.4)" }}
          >
            ?뮠 ?ъ＜ Q&amp;A ??臾댁뾿?대뱺 臾쇱뼱蹂댁꽭??          </button>
        )}

        {/* ?? ?먯닔 ?붿빟 移대뱶 ?? */}
        <div
          ref={el => { cardRefs.current[0] = el; }}
          style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12, overflow: "hidden" }}
        >
          <div style={{ background: tier === "package" ? "#eab308" : G, color: tier === "package" ? "#3a2a00" : "white", textAlign: "center", borderRadius: "22px 22px 0 0" }}>
            <p style={{ fontSize: 15, fontWeight: 900, margin: 0, padding: "10px 20px 0", letterSpacing: "-0.3px" }}>{brand?.businessName ? `?맩 ${brand.businessName} 쨌 AI ?ъ＜ 遺꾩꽍` : "?맩 ?먯슫 쨌 AI ?ъ＜ 遺꾩꽍"}</p>
            <div style={{ padding: "14px 20px 24px" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>?뵰</div>
              <h1 style={{ fontSize: 15, fontWeight: 900, margin: "0 0 12px", opacity: 0.9 }}>{profile?.name}?섏쓽 ?댁꽭 遺꾩꽍</h1>
              <ScoreCircle score={scores?.total ?? 0} size={130} />
              <p style={{ fontSize: 12, opacity: 0.75, margin: "8px 0 0", fontWeight: 600 }}>珥앹슫 ?먯닔</p>
            </div>
          </div>
          {/* ??궎 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "0 18px 12px" }}>
            {[{ label: "?됱슫 ??, value: luckyColor, icon: "?렓" }, { label: "?됱슫 ?レ옄", value: luckyNumber, icon: "?뵢" }, { label: "?됱슫 諛⑺뼢", value: luckyDirection, icon: "?㎛" }].map(item => (
              <div key={item.label} style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{item.value}</div>
              </div>
            ))}
          </div>
          {/* 6媛??댁꽭 ?먯닔 諛?*/}
          <div style={{ padding: "4px 18px 18px" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", marginBottom: 14 }}>?뱤 遺꾩빞蹂??댁꽭 ?먯닔</div>
            {[
              { label: "?뙚 ?ㅻ뒛???댁꽭", key: "total",   color: "#f59e0b" },
              { label: "?뮥 ?щЪ??,      key: "wealth",  color: "#f59e0b" },
              { label: "?뮆 ?곗븷??,      key: "love",    color: "#ec4899" },
              { label: "?뮞 嫄닿컯??,      key: "health",  color: "#10b981" },
              { label: "?렞 ?깃났??,      key: "success", color: "#8b5cf6" },
              { label: "??珥앹슫",        key: "total",   color: "#6366f1" },
            ].map(b => (
              <ScoreBar key={b.label} label={b.label} score={scores?.[b.key as keyof typeof scores] ?? 0} color={b.color} />
            ))}
          </div>

          {/* ?? 臾대즺/990?? ?ъ＜?붿옄 留쏅낫湲?(?대?吏 ??μ뿉 ?ы븿?섎룄濡?summary 移대뱶 ?덉뿉 ?꾩튂) ?? */}
          {(tier === "free" || tier === "select") && profile?.birthYear && (() => {
            const zodiacList = ["伊?,"??,"?몃옉??,"?좊겮","??,"諭","留?,"??,"?먯댂??,"??,"媛?,"?쇱?"];
            const ohArr = ["紐?,"紐?,"??,"??,"??,"??,"湲?,"湲?,"??,"??];
            const ohEmoji: Record<string,string> = { "紐?:"?뙰","??:"?뵦","??:"?곤툘","湲?:"??,"??:"?뮛" };
            const y = Number(profile.birthYear);
            const z = zodiacList[((y - 4) % 12 + 12) % 12];
            const oh = ohArr[((y - 4) % 10 + 10) % 10];
            return (
              <div style={{ margin: "0 12px 12px", borderRadius: 16, overflow: "hidden", border: "1.5px solid rgba(236,72,153,0.12)" }}>
                <div style={{ background: G, color: "white", padding: "10px 16px", fontSize: 13, fontWeight: 900 }}>?뵰 {profile?.name}?섏쓽 ?ъ＜?붿옄 留쏅낫湲?/div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "14px 16px" }}>
                  <div style={{ background: BG, borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 3 }}>?릧</div>
                    <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>??/div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#1a1a2e" }}>{z}??/div>
                  </div>
                  <div style={{ background: BG, borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 3 }}>{ohEmoji[oh]}</div>
                    <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>?ㅽ뻾</div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#1a1a2e" }}>{oh}({oh === "紐? ? "?? : oh === "?? ? "?? : oh === "?? ? "?? : oh === "湲? ? "?? : "麗?})</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ?? ?⑦궎吏 ?꾩슜: ?ъ＜?붿옄 ?쒕늿??蹂닿린 (?대?吏 ??μ뿉 ?ы븿?섎룄濡?summary 移대뱶 ?덉뿉 ?꾩튂) ?? */}
          {tier === "package" && profile?.birthYear && (() => {
            const zodiacList = ["伊?,"??,"?몃옉??,"?좊겮","??,"諭","留?,"??,"?먯댂??,"??,"媛?,"?쇱?"];
            const ohArr = ["紐?,"紐?,"??,"??,"??,"??,"湲?,"湲?,"??,"??];
            const ganList = ["媛?,"??,"蹂?,"??,"臾?,"湲?,"寃?,"??,"??,"怨?];
            const ohEmoji: Record<string,string> = { "紐?:"?뙰","??:"?뵦","??:"?곤툘","湲?:"??,"??:"?뮛" };
            const y = Number(profile.birthYear);
            const z = zodiacList[((y - 4) % 12 + 12) % 12];
            const oh = ohArr[((y - 4) % 10 + 10) % 10];
            const gan = ganList[((y - 4) % 10 + 10) % 10];
            const dayMsgs = [
              "?ㅻ뒛? 洹몃룞??誘몃쨪??寃곗젙???대━湲?醫뗭? ?좎엯?덈떎.",
              "?ㅻ뒛? ?щ엺怨쇱쓽 ?몄뿰???됱냼蹂대떎 媛뺥븯寃??묐룞?섎뒗 ?좎엯?덈떎.",
              "?ㅻ뒛? ?덇낵 愿?⑤맂 ?묒? ?좏깮??湲멸쾶 ?곹뼢??誘몄튂???좎엯?덈떎.",
              "?ㅻ뒛? 紐몄쓽 ?좏샇??議곌툑 ??洹 湲곗슱?ъ빞 ?섎뒗 ?좎엯?덈떎.",
              "?ㅻ뒛? ?덈줈???쒕룄瑜??대낵 留뚰븳 湲곗슫???먮Ⅴ???좎엯?덈떎.",
              "?ㅻ뒛? 李⑤텇???뺣━?섍퀬 ?뚯븘蹂닿린 醫뗭? ?좎엯?덈떎.",
              "?ㅻ뒛? ?됱냼蹂대떎 吏곴???誘우뼱??醫뗭? ?좎엯?덈떎.",
            ];
            const dIdx = new Date().getDay();
            const tomorrowMsgs = [
              "?댁씪? 媛源뚯슫 ?щ엺怨쇱쓽 ??붿뿉??醫뗭? 湲곗슫???ㅼ뼱?듬땲??",
              "?댁씪? ?묒? 湲고쉶媛 ?됱냼蹂대떎 ?덉뿉 ???ㅼ뼱?ㅻ뒗 ?먮쫫?낅땲??",
              "?댁씪? ?щЪ怨?愿?⑤맂 ?좏샇瑜??덉뿬寃⑤킄???섎뒗 ?먮쫫?낅땲??",
              "?댁씪? 紐멸낵 留덉쓬??梨숆린??寃껋씠 ?곗꽑???먮쫫?낅땲??",
              "?댁씪? ?덈줈???몄뿰?대굹 ?쒖븞???ㅼ뼱?????덈뒗 ?먮쫫?낅땲??",
              "?댁씪? ?ㅻ뒛 ??寃곗젙??寃곌낵媛 ?쒖꽌???쒕윭?섎뒗 ?먮쫫?낅땲??",
              "?댁씪? ??二쇰? 以鍮꾪븯??留덉쓬媛吏먯씠 以묒슂???먮쫫?낅땲??",
            ];
            return (
              <div style={{ margin: "0 12px 12px", background: "#fdf6e3", borderRadius: 16, overflow: "hidden", border: "1.5px solid rgba(217,180,80,0.45)" }}>
                <div style={{ background: G_PREMIUM, color: "white", padding: "10px 16px", fontSize: 13, fontWeight: 900 }}>?が {profile?.name}?섏쓽 ?ъ＜?붿옄 ?쒕늿??蹂닿린</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "14px 16px" }}>
                  <div style={{ background: BG, borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 3 }}>?릧</div>
                    <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>??/div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#1a1a2e" }}>{z}??/div>
                  </div>
                  <div style={{ background: BG, borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 3 }}>{ohEmoji[oh]}</div>
                    <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>?ㅽ뻾</div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#1a1a2e" }}>{oh}({oh === "紐? ? "?? : oh === "?? ? "?? : oh === "?? ? "?? : oh === "湲? ? "?? : "麗?})</div>
                  </div>
                  <div style={{ background: BG, borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, marginBottom: 3 }}>?뙰</div>
                    <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>泥쒓컙</div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#1a1a2e" }}>{gan}({gan === "媛? ? "?? : gan === "?? ? "阿? : gan === "蹂? ? "訝? : gan === "?? ? "訝? : gan === "臾? ? "?? : gan === "湲? ? "藥? : gan === "寃? ? "佯? : gan === "?? ? "渦? : gan === "?? ? "鶯? : "??})</div>
                  </div>
                </div>
                <div style={{ padding: "0 16px 14px" }}>
                  <div style={{ background: "#f5f3ff", borderRadius: 12, padding: "10px 12px", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: "#6d28d9", fontWeight: 800, marginBottom: 3 }}>?뵰 ?ㅻ뒛???쒕쭏??/div>
                    <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6 }}>{dayMsgs[dIdx]}</div>
                  </div>
                  <div style={{ background: "#f5f3ff", borderRadius: 12, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "#6d28d9", fontWeight: 800, marginBottom: 3 }}>?뙔 ?댁씪???덇퀬</div>
                    <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6 }}>{tomorrowMsgs[(dIdx + 1) % 7]}</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ?? 臾대즺: ?ㅻ뒛???댁꽭 移대뱶 ?? */}
        {tier === "free" && (
          <div
            ref={el => { cardRefs.current[1] = el; }}
            style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(34,197,94,0.25)", marginBottom: 12 }}
          >
            <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid rgba(236,72,153,0.07)" }}>
              <span style={{ fontSize: 22 }}>?뙚</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>?ㅻ뒛???댁꽭</span>
              <span style={{ fontSize: 10, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>FREE</span>
            </div>
            <div style={{ padding: "14px 18px 20px" }}>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all", overflowWrap: "anywhere" }}>
                {freeAnalysis}
              </p>
            </div>
          </div>
        )}

        {/* ?? ?뱀떊??蹂???? ?먮옒 紐⑹쟻? "臾대즺 寃곌낵瑜?蹂??щ엺?먭쾶 寃곗젣瑜??좊룄"?섎뒗 寃껊퓧?대씪,
             ?대? 寃곗젣???щ엺?먭쾶?????댁긽 蹂댁뿬以??댁쑀媛 ?놁쓬(寃곗젣 吏곹뻾??留덉갔媛吏 ???좊룄??             ??곸씠 ?꾩삁 ?꾨땲?덉쑝誘濡?移⑸룄 ??蹂댁뿬以?. 洹몃옒??
             - 臾대즺(tier=free): ??긽 移??좏깮 ??怨좊Ⅴ硫?hidden2瑜?釉붾윭+寃곗젣 ?좊룄 踰꾪듉?쇰줈 蹂댁뿬以?             - ?좊즺(select/package): 臾대즺?먯꽌 ?ㅼ젣濡?怨⑤옄???곸씠 ?덈뒗 ?щ엺?쒗뀒留? 寃곗젣 ??               ????踰??꾩껜 怨듦컻濡?蹂댁뿬二쇨퀬(蹂대꼫???깃꺽), 洹??ㅼ쓬遺?곕뒗(媛숈? ?щ엺 ?ш뎄留??ы븿)
               ?ㅼ떆 蹂댁뿬二쇱? ?딆쓬. 寃곗젣 吏곹뻾(怨좊Ⅸ ???놁쓬)? ?뱀뀡 ?먯껜瑜??쒖떆?섏? ?딆쓬 */}
        {!isPartner && (tier === "free" || tier === "select" || tier === "package") && profile?.name && profile?.birthYear && (() => {
          const locked = tier === "free";
          const interestOptions = ["?뮥 ??, "?뮆 ?좎젙", "?렞 ?깃났", "?뮳 ?ъ뾽", "?뭾 寃고샎", "?룫 吏곸옣", "?뫔 ?먮?", "?뱰 ?숈뾽", "?뮞 嫄닿컯"];
          // main-v2/profile(臾대즺)? ???쇱쓣 "05"泥섎읆 0?⑤뵫?댁꽌 ??ν븯怨?paid-info-input(寃곗젣
          // 吏곹뻾)? "5"泥섎읆 ?⑤뵫 ?놁씠 ??ν빐?? 媛숈? ?щ엺쨌媛숈? ?앹씪?댁뼱???ㅺ? ??留욎쓣 ???덉뼱
          // ?レ옄濡??뺢퇋?뷀빐??鍮꾧탳. ?좎쭨瑜??ㅼ뿉 ?ы븿?쒖폒 "?ㅻ뒛 ?섎（"留??좎??섍퀬
          // ?ㅼ쓬 ???덈줈 臾대즺 遺꾩꽍???섎㈃ ?ㅼ떆 ??踰?蹂댁뿬二쇰룄濡??먮룞 珥덇린?붾릺寃???          const todayKey = new Date().toDateString();
          const interestKey = `v2_change_interest_${profile.name}_${profile.birthYear}_${Number(profile.birthMonth)}_${Number(profile.birthDay)}_${todayKey}`;
          const consumedKey = `${interestKey}_consumed`;

          if (locked) {
            // ?ㅻ뒛 ?대? 寃곗젣濡??꾩껜怨듦컻瑜?諛쏆? ?곸씠 ?덉쑝硫? 臾대즺 履쎌뿉????移⑹쓣 怨좊Ⅴ怨?            // 寃곗젣?대룄 ????蹂댁뿬以?嫄곕씪?????룰컝由ъ? ?딄쾶 移?寃곗젣?좊룄 ????덈궡留?蹂댁뿬以?            const alreadyConsumedToday = freeConsumedSnapshot === true;
            if (alreadyConsumedToday) {
              return (
                <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(255,215,0,0.4)", marginBottom: 12, overflow: "hidden", padding: "18px", textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#f97316", margin: "0 0 6px" }}>?럞 ?ㅻ뒛??"?뱀떊??蹂?????대? 諛쏆쑝?⑥뼱??br />?댁씪 ?ㅼ떆 留뚮굹??</p>
                  <p style={{ fontSize: 11, color: "#d4af37", fontWeight: 700, margin: 0 }}>???뱀떊??蹂?붾뒗 ?섎（????踰덈쭔 留뚮굹蹂????덈뒗<br/>?밸퀎??硫붿떆吏?덉슂</p>
                </div>
              );
            }
            // ?ㅻ뒛 ?대? 移⑹쓣 ??踰?怨좊Ⅸ ?곸씠 ?덉쑝硫??꾩쭅 寃곗젣 ??, ?ㅼ떆 ?ㅼ뼱?????            // 怨좊Ⅴ?쇨퀬 ?섏? ?딄퀬 洹??좏깮??洹몃?濡??댁뼱??蹂댁뿬以???寃곗젣 ?꾧퉴吏??            // 釉붾윭+寃곗젣?좊룄 ?붾㈃??怨꾩냽 ?좎???            const savedInterestToday = typeof window !== "undefined" ? localStorage.getItem(interestKey) : null;
            const directInterest = changeInterest
              ?? (savedInterestToday && interestOptions.includes(savedInterestToday) ? savedInterestToday : null);
            if (!directInterest) {
              return (
                <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(255,215,0,0.4)", marginBottom: 12, overflow: "hidden" }}>
                  <div style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a1a1a", padding: "12px 18px", fontSize: 13, fontWeight: 900 }}>?렞 {profile.name}?섏쓽 蹂??/div>
                  <div style={{ padding: "16px 18px 20px" }}>
                    <p style={{ fontSize: 13, color: "#374151", fontWeight: 700, margin: "0 0 12px", textAlign: "center" }}>吏湲?媛??沅곴툑??寃??덈떎硫?怨⑤씪蹂댁꽭??/p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {interestOptions.map(opt => (
                        <button key={opt} onClick={() => { localStorage.setItem(interestKey, opt); setChangeInterest(opt); }}
                          style={{ padding: "10px 4px", borderRadius: 10, border: "1.5px solid #fbbf24", background: "#fffbeb", color: "#92400e", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            const yc = getYourChangeType(profile.name, profile.birthYear, profile.birthMonth, profile.birthDay, undefined, directInterest);
            return (
              <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(255,215,0,0.4)", marginBottom: 12, overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a1a1a", padding: "12px 18px", fontSize: 13, fontWeight: 900 }}>?렞 {profile.name}?섏쓽 蹂??/div>
                <div style={{ padding: "16px 18px 20px" }}>
                  <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 800, margin: "0 0 6px" }}>{yc.category}</p>
                  <h3 style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px", borderBottom: "2px solid #fbbf24", paddingBottom: 8 }}>??{yc.title}</h3>
                  <div style={{ margin: "0 0 12px" }}>
                    {yc.insight.split("\n").flatMap(splitLong).map((line, i) => (
                      <p key={i} style={{ fontSize: 12.5, color: "#374151", fontWeight: 700, fontStyle: "italic", lineHeight: 1.6, margin: "0 0 4px", wordBreak: "keep-all", overflowWrap: "break-word" }}>{i === 0 ? `"${line}` : line}</p>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "#f59e0b", fontWeight: 900, margin: "0 0 6px" }}>?렞 ?뱀떊??蹂??/p>
                  <div style={{ margin: "0 0 12px" }}>
                    {yc.hidden1.split("\n").flatMap(splitLong).map((line, i) => (
                      <p key={i} style={{ fontSize: 12.5, color: "#374151", fontWeight: 600, lineHeight: 1.6, margin: "0 0 4px", wordBreak: "keep-all", overflowWrap: "break-word" }}>{line}</p>
                    ))}
                  </div>
                  <div style={{ background: "rgba(255,215,0,0.12)", borderRadius: 10, padding: "10px 12px", filter: "blur(3px)", userSelect: "none", pointerEvents: "none" }}>
                    <p style={{ fontSize: 10, color: "#d4af37", fontWeight: 800, margin: "0 0 6px" }}>?뵰 990??寃곗젣 ??怨듦컻</p>
                    {yc.hidden2.split("\n").flatMap(splitLong).map((line, i) => (
                      <p key={i} style={{ fontSize: 13, color: "#1a1a2e", fontWeight: 700, margin: "0 0 4px", wordBreak: "keep-all", overflowWrap: "break-word" }}>{line}</p>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: "#dc2626", fontWeight: 800, margin: "12px 0 0", textAlign: "center", fontStyle: "italic" }}>?몛 {profile.name}?섏쓽 ?뺥솗??蹂???쒖젏怨?br/>援ъ껜?곸씤 ?ㅽ뻾踰뺤씠 <span style={{ display: "inline-block", background: "#ec4899", color: "white", fontWeight: 900, fontStyle: "normal", padding: "2px 10px", borderRadius: 8, margin: "0 2px" }}>990??寃곗젣</span> ??紐⑤몢 怨듦컻?⑸땲??/p>
                  <button onClick={() => router.push("/main-v2/payment?scrollTo=select")} style={{ width: "100%", marginTop: 14, padding: "13px 0", background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 13, cursor: "pointer" }}>?뭿 {yc.category} ?꾨꼍 怨듬왂踰?蹂닿린</button>
                </div>
              </div>
            );
          }

          // ?좊즺: 臾대즺?먯꽌 ?ㅼ젣濡?怨좊Ⅸ ?곸씠 ?덉뼱?쇰쭔, 洹몃━怨??꾩쭅 ??踰덈룄 ??蹂댁뿬以ъ쓣 ?뚮쭔 ?몄텧.
          // "??遊ㅻ떎"???쒖떆??蹂꾨룄??useEffect?먯꽌 ?섍퀬(?꾨옒 李멸퀬) ?ш린?쒕뒗 ?쎄린留?????          // ?뚮뜑留?以묒뿉 吏곸젒 localStorage.setItem???섎㈃ 由ъ븸?멸? ?쒖닔??寃?щ? ?꾪빐
          // ?뚮뜑瑜???踰??몄텧??????踰덉㎏ ?몄텧?먯꽌 "?대? ??遊ㅼ쓬"?쇰줈 ?쏀???諛붾줈
          // ?щ씪??蹂댁씠??踰꾧렇媛 ?덉뿀??          const savedInterest = typeof window !== "undefined" ? localStorage.getItem(interestKey) : null;
          const alreadyConsumed = paidConsumedSnapshot === true;
          if (!savedInterest || !interestOptions.includes(savedInterest) || alreadyConsumed) return null;
          const yc = getYourChangeType(profile.name, profile.birthYear, profile.birthMonth, profile.birthDay, undefined, savedInterest);
          return (
            <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(255,215,0,0.4)", marginBottom: 12, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a1a1a", padding: "12px 18px", fontSize: 13, fontWeight: 900 }}>?렞 {profile.name}?섏쓽 蹂?????꾩껜 怨듦컻</div>
              <div style={{ padding: "16px 18px 20px" }}>
                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 800, margin: "0 0 6px" }}>{yc.category}</p>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px", borderBottom: "2px solid #fbbf24", paddingBottom: 8 }}>??{yc.title}</h3>
                <div style={{ margin: "0 0 12px" }}>
                  {yc.insight.split("\n").flatMap(splitLong).map((line, i) => (
                    <p key={i} style={{ fontSize: 12.5, color: "#374151", fontWeight: 700, fontStyle: "italic", lineHeight: 1.6, margin: "0 0 4px", wordBreak: "keep-all", overflowWrap: "break-word" }}>{i === 0 ? `"${line}` : line}</p>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "#f59e0b", fontWeight: 900, margin: "0 0 6px" }}>?렞 ?뱀떊??蹂??/p>
                <div style={{ margin: "0 0 12px" }}>
                  {yc.hidden1.split("\n").flatMap(splitLong).map((line, i) => (
                    <p key={i} style={{ fontSize: 12.5, color: "#374151", fontWeight: 600, lineHeight: 1.6, margin: "0 0 4px", wordBreak: "keep-all", overflowWrap: "break-word" }}>{line}</p>
                  ))}
                </div>
                <div style={{ background: "rgba(255,215,0,0.12)", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 10, color: "#d4af37", fontWeight: 800, margin: "0 0 6px" }}>?뵰 援ъ껜?곸씤 蹂???쒖젏</p>
                  {yc.hidden2.split("\n").flatMap(splitLong).map((line, i) => (
                    <p key={i} style={{ fontSize: 13, color: "#1a1a2e", fontWeight: 700, margin: "0 0 4px", wordBreak: "keep-all", overflowWrap: "break-word" }}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ?? 990?? ?좏깮??5媛??댁꽭 ?? */}
        {tier === "select" && Object.keys(allAnalyses).length > 0 && (
          ALL_SCORE_CATS.filter(c => c.key !== FREE_CAT && paidCats.includes(c.key)).map((c, i) => (
            <div key={c.key} ref={el => { cardRefs.current[2 + i] = el; }}
              style={{ background: "white", borderRadius: 24, border: `1.5px solid ${c.color}44`, marginBottom: 12 }}>
              <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid rgba(236,72,153,0.07)" }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>{c.key.replace(/\S+\s/, "")}</span>
                <span style={{ fontSize: 10, background: G, color: "white", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>?뭿 ?ъ링</span>
              </div>
              <div style={{ padding: "14px 18px 20px" }}>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all", overflowWrap: "anywhere" }}>
                  {allAnalyses[c.key] ?? ""}
                </p>
              </div>
            </div>
          ))
        )}

        {/* ?? ?⑦궎吏(9900~29900): ?⑦궎吏蹂??댁꽭 ?? */}
        {tier === "package" && Object.keys(allAnalyses).length > 0 && (
          (PKG_CAT_MAP[pkgName] ?? PKG_CAT_MAP["湲곕낯 遺꾩꽍"]).filter(c => allAnalyses[c.apiKey]).map((c, i) => (
            <div key={c.apiKey} ref={el => { cardRefs.current[2 + i] = el; }}
              style={{ background: "#fdf6e3", borderRadius: 24, border: "1.5px solid rgba(217,180,80,0.45)", marginBottom: 12, boxShadow: "0 2px 14px rgba(217,180,80,0.12)" }}>
              <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid rgba(217,180,80,0.18)", background: "linear-gradient(90deg, rgba(217,180,80,0.10), transparent)" }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>{c.label}</span>
                <span style={{ fontSize: 10, background: G_PREMIUM, color: "white", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>?벀 ?⑦궎吏</span>
                {c.apiKey === "?뭾 寃고샎쨌沅곹빀?? && (
                  <span style={{ fontSize: 10, background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>?뮒 沅곹빀 {scores?.total ?? 0}%</span>
                )}
              </div>
              <div style={{ padding: "14px 18px 20px" }}>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all", overflowWrap: "anywhere" }}>
                  {allAnalyses[c.apiKey]}
                </p>
              </div>
            </div>
          ))
        )}


        {/* ?? 臾대즺: 荑좏룿 ?쇰꼸 ?? */}
        {tier === "free" && !isPartner && (
          <div style={{ marginBottom: 16, borderRadius: 18, background: "linear-gradient(135deg, #fff7ed, #fef3c7)", border: "1.5px solid rgba(245,158,11,0.35)", padding: "20px 18px" }}>
            {couponCode ? (
              <>
                <p style={{ fontSize: 14, fontWeight: 900, color: "#92400e", margin: "0 0 6px" }}>?럦 荑좏룿??諛쒓툒?먯뼱??</p>
                <p style={{ fontSize: 12, color: "#78350f", margin: "0 0 12px", lineHeight: 1.6 }}>寃곗젣 ?붾㈃?먯꽌 ?꾨옒 肄붾뱶瑜??낅젰?섎㈃ <b>30% ?좎씤</b>???곸슜?쇱슂.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, background: "white", border: "2px dashed rgba(245,158,11,0.5)", borderRadius: 10, padding: "10px 14px", fontFamily: "monospace", fontSize: 18, fontWeight: 900, color: "#b45309", letterSpacing: 2, textAlign: "center" }}>
                    {couponCode}
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(couponCode).then(() => alert("蹂듭궗?먯뼱??")).catch(() => alert(couponCode)); }}
                    style={{ padding: "10px 14px", background: "#f59e0b", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}
                  >蹂듭궗</button>
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: 14, fontWeight: 900, color: "#92400e", margin: "0 0 4px" }}>?럞 30% ?좎씤 荑좏룿 諛쏄린</p>
                <p style={{ fontSize: 12, color: "#78350f", margin: "0 0 12px" }}>?곕씫泥섎쭔 ?④린硫?諛붾줈 荑좏룿肄붾뱶瑜??쒕젮??</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="tel"
                    value={couponPhone}
                    onChange={e => setCouponPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    style={{ flex: 1, padding: "10px 12px", border: "1.5px solid rgba(245,158,11,0.4)", borderRadius: 10, fontSize: 14, outline: "none", background: "white", color: "#1f2937" }}
                  />
                  <button
                    disabled={couponSubmitting || couponPhone.replace(/\D/g, "").length < 10}
                    onClick={async () => {
                      setCouponSubmitting(true);
                      try {
                        const res = await fetch("/api/coupon-lead", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ phone: couponPhone, name: profile?.name ?? "" }),
                        });
                        const data = await res.json();
                        if (data.code) setCouponCode(data.code);
                        else alert("荑좏룿 諛쒓툒???ㅽ뙣?덉뼱?? ?ㅼ떆 ?쒕룄?댁＜?몄슂.");
                      } catch { alert("?ㅽ듃?뚰겕 ?ㅻ쪟媛 諛쒖깮?덉뼱??"); }
                      finally { setCouponSubmitting(false); }
                    }}
                    style={{ padding: "10px 16px", background: "#f59e0b", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 13, cursor: couponPhone.replace(/\D/g, "").length < 10 ? "not-allowed" : "pointer", opacity: couponPhone.replace(/\D/g, "").length < 10 ? 0.6 : 1, whiteSpace: "nowrap" }}
                  >{couponSubmitting ? "..." : "荑좏룿諛쏄린"}</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ?? 臾대즺: 怨듭쑀?섍린 + ?좊즺 寃곗젣?섍린 ?? */}
        {tier === "free" && (
          <>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => setShowShareModal(true)}
                style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #fce7f3, #fbcfe8)", color: "#be185d", border: "1.5px solid rgba(236,72,153,0.3)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(236,72,153,0.18)" }}>
                ?뱾 怨듭쑀?섍린
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2?modal=naming")}
                style={{ width: "100%", padding: "15px 0", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(245,158,11,0.35)" }}>
                ?뵰 990???ъ＜ ?꾩껜 蹂닿린
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/payment-complete?special=sinyeon_premium&paid=4900")}
                style={{ width: "100%", padding: "13px 0", background: "rgba(40,5,5,0.9)", color: "white", border: "1.5px solid rgba(239,68,68,0.8)", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 16px rgba(239,68,68,0.25)" }}>
                ?뱟 ?좊뀈+?붾퀎 12??<span style={{ color: "#ef4444" }}>??,900</span>
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/payment")}
                style={{ width: "100%", padding: "15px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
                ?뮩 ?좊즺 ?댁꽭 寃곗젣?섍린
              </button>
            </div>
          </>
        )}

        {/* ?? 990?? 怨듭쑀?섍린 + ?좊즺 寃곗젣?섍린 + ?ㅼ떆 遺꾩꽍 + 蹂닿???????? */}
        {tier === "select" && (
          <>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => setShowShareModal(true)}
                style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #fce7f3, #fbcfe8)", color: "#be185d", border: "1.5px solid rgba(236,72,153,0.3)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(236,72,153,0.18)" }}>
                ?뱾 怨듭쑀?섍린
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/payment")}
                style={{ width: "100%", padding: "15px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
                ?뮩 ?좊즺 ?댁꽭 寃곗젣?섍린
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => { sessionStorage.removeItem("v2_paid"); sessionStorage.removeItem("v2_paid_cats"); sessionStorage.removeItem("price"); router.push("/main-v2/payment"); }}
                style={{ width: "100%", padding: "12px 0", background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#6d28d9", border: "1.5px solid rgba(139,92,246,0.35)", borderRadius: 50, fontWeight: 800, fontSize: 12, cursor: "pointer", boxShadow: "0 2px 10px rgba(139,92,246,0.15)" }}>
                ?뵰 ?ㅼ떆 遺꾩꽍
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/history")}
                style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)", color: "#4338ca", border: "1.5px solid rgba(99,102,241,0.35)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(99,102,241,0.18)" }}>
                ?뱿 蹂닿??????              </button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <button onClick={saveImage} disabled={saving}
                style={{ width: "100%", padding: "14px 0", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.3)", opacity: saving ? 0.7 : 1 }}>
                {saving ? "?????以?.." : "?뼹截??대?吏 ???}
              </button>
            </div>
          </>
        )}

        {/* ?? ?⑦궎吏(9900~29900): 怨듭쑀?섍린 + ?좊즺 寃곗젣?섍린 + ?ㅼ떆 遺꾩꽍 + 蹂닿??????+ ?대?吏 ????? */}
        {tier === "package" && (
          <>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => setShowShareModal(true)}
                style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #fce7f3, #fbcfe8)", color: "#be185d", border: "1.5px solid rgba(236,72,153,0.3)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(236,72,153,0.18)" }}>
                ?뱾 怨듭쑀?섍린
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/payment")}
                style={{ width: "100%", padding: "15px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
                ?뮩 ?좊즺 ?댁꽭 寃곗젣?섍린
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => { sessionStorage.removeItem("v2_paid"); sessionStorage.removeItem("v2_paid_cats"); sessionStorage.removeItem("price"); router.push("/main-v2/payment"); }}
                style={{ width: "100%", padding: "12px 0", background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#6d28d9", border: "1.5px solid rgba(139,92,246,0.35)", borderRadius: 50, fontWeight: 800, fontSize: 12, cursor: "pointer", boxShadow: "0 2px 10px rgba(139,92,246,0.15)" }}>
                ?뵰 ?ㅼ떆 遺꾩꽍
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/history")}
                style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)", color: "#4338ca", border: "1.5px solid rgba(99,102,241,0.35)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(99,102,241,0.18)" }}>
                ?뱿 蹂닿??????              </button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <button onClick={saveImage} disabled={saving}
                style={{ width: "100%", padding: "14px 0", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.3)", opacity: saving ? 0.7 : 1 }}>
                {saving ? "?????以?.." : "?뼹截??대?吏 ???}
              </button>
            </div>
          </>
        )}

        {!isPartner && (
          <div style={{ margin: "16px 0 8px", borderRadius: 16, background: "linear-gradient(135deg, #ec4899, #8b5cf6)", padding: "16px 20px", textAlign: "center", cursor: "pointer" }} onClick={() => router.push("/main-v2")}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: "white", letterSpacing: "-0.3px" }}>?뵰 AI ?ъ＜ 990?먮????쒖옉</p>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>吏湲?諛붾줈 ???댁꽭 ?뺤씤?섍린 ??/p>
          </div>
        )}

        <button onClick={() => router.push("/main-v2")}
          style={{ width: "100%", marginTop: 10, padding: "11px 0", background: "transparent", color: "#9ca3af", border: "none", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
          ?룧 ?덉쑝濡?        </button>

        {/* ?? ?ъ＜ Q&A 諛곕꼫 (臾댁뾿?대뱺 臾쇱뼱蹂댁꽭?????대┃ ??Q&A ?섏씠吏 ?대룞) ?? */}
        {!isPartner && profile?.name && profile?.birthYear && (
          <div
            onClick={() => { router.push("/main-v2/qa-list"); }}
            style={{
              marginTop: 8, marginBottom: 14,
              borderRadius: 20, overflow: "hidden", cursor: "pointer",
              background: "linear-gradient(135deg, #1a0635 0%, #3b0764 50%, #1e0a3c 100%)",
              boxShadow: "0 10px 36px rgba(139,92,246,0.45)",
              position: "relative", minHeight: 140,
            }}
          >
            <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(236,72,153,0.18)", filter: "blur(30px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(139,92,246,0.2)", filter: "blur(25px)", pointerEvents: "none" }} />
            <div style={{ padding: "22px 20px 20px", position: "relative", zIndex: 2 }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: "#fbbf24", background: "rgba(251,191,36,0.18)", border: "1px solid rgba(251,191,36,0.4)", padding: "3px 10px", borderRadius: 20, letterSpacing: 0.5 }}>AI ?ъ＜ ?곷떞</span>
              <p style={{ fontSize: 30, fontWeight: 900, color: "#ffffff", margin: "8px 0 2px", lineHeight: 1.15, letterSpacing: -1 }}>
                臾댁뾿?대뱺<br/>臾쇱뼱蹂댁꽭??              </p>
              <p style={{ fontSize: 13, color: "#fbbf24", fontWeight: 800, margin: "0 0 12px", minHeight: 20 }}>
                ?뮠 &ldquo;{BANNER_MSGS[bannerIdx]}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 13, boxShadow: "0 4px 14px rgba(236,72,153,0.5)" }}>?ъ＜ ?곷떞 ??/span>
                <span style={{ fontSize: 11, color: "white", fontWeight: 900 }}>留ㅼ씪 臾대즺 3??/span>
              </div>
            </div>
            <div style={{ position: "absolute", right: 10, bottom: 0, zIndex: 2, userSelect: "none", textAlign: "center" }}>
              <div style={{ fontSize: 13, marginBottom: 2, animation: "sparkle 1.5s infinite alternate", opacity: 0.9 }}>??狩???/div>
              <div style={{ fontSize: 72, lineHeight: 1 }}>?맩</div>
            </div>
            <style>{`@keyframes sparkle { from { opacity: 0.5; transform: scale(0.95); } to { opacity: 1; transform: scale(1.05); } }`}</style>
          </div>
        )}

        {/* 蹂듬깷??梨꾪똿 */}
        {!isPartner && profile?.name && profile?.birthYear && (
          <QAChatWidget name={profile.name} birthYear={Number(profile.birthYear)} unlocked={paid} />
        )}
      </div>

      {/* ?? ?댁꽭 ?좏깮 紐⑤떖 ?? */}
      {showSelect && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          onClick={e => { if (e.target === e.currentTarget) setShowSelect(false); }}
        >
          <div style={{ width: "100%", maxWidth: 480, background: "white", borderRadius: "28px 28px 0 0", padding: "28px 20px 40px", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
            <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 99, margin: "0 auto 20px" }} />

            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px", textAlign: "center" }}>?대뼡 ?댁꽭瑜??뺤씤?좉퉴??</h2>
            <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: "0 0 20px" }}>
              {selectedCats.length > 0
                ? <><span style={{ color: "#ec4899", fontWeight: 800 }}>{selectedCats.length}媛?/span> ?좏깮 쨌 <span style={{ color: "#8b5cf6", fontWeight: 800 }}>??(selectedCats.length * 990).toLocaleString()}</span></>
                : "?댁꽭瑜??좏깮?섏꽭??}
            </p>

            {/* ?꾩껜 ?좏깮 */}
            <button
              onClick={() => setSelectedCats(selectedCats.length === SELECT_CATS.length ? [] : SELECT_CATS.map(c => c.key))}
              style={{ width: "100%", padding: "10px 16px", marginBottom: 12, background: selectedCats.length === SELECT_CATS.length ? "#fdf2f8" : "white", border: `1.5px solid ${selectedCats.length === SELECT_CATS.length ? "#ec4899" : "#e5e7eb"}`, borderRadius: 14, fontWeight: 800, fontSize: 13, color: selectedCats.length === SELECT_CATS.length ? "#ec4899" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <span>???꾩껜 ?좏깮</span>
              <span style={{ fontSize: 16 }}>{selectedCats.length === SELECT_CATS.length ? "?묕툘" : "燧?}</span>
            </button>

            {/* 媛쒕퀎 ?댁꽭 移대뱶 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
              {SELECT_CATS.map(c => {
                const on = selectedCats.includes(c.key);
                return (
                  <button key={c.key}
                    onClick={() => setSelectedCats(on ? selectedCats.filter(k => k !== c.key) : [...selectedCats, c.key])}
                    style={{ padding: "14px 16px", border: `1.5px solid ${on ? c.color : "#e5e7eb"}`, borderRadius: 16, background: on ? `${c.color}10` : "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{c.icon}</span>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: on ? c.color : "#374151" }}>{c.key.replace(/\S+\s/, "")}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 18 }}>{on ? "?? : "燧?}</span>
                  </button>
                );
              })}
            </div>

            {/* 寃곗젣 踰꾪듉 */}
            <button
              onClick={goToPay}
              disabled={selectedCats.length === 0}
              style={{ width: "100%", padding: "16px 0", background: selectedCats.length > 0 ? G : "#e5e7eb", color: selectedCats.length > 0 ? "white" : "#9ca3af", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: selectedCats.length > 0 ? "pointer" : "not-allowed", boxShadow: selectedCats.length > 0 ? "0 6px 20px rgba(236,72,153,0.35)" : "none" }}
            >
              {selectedCats.length > 0
                ? `?뭿 ${selectedCats.length}媛??댁꽭 蹂닿린 쨌 ??{(selectedCats.length * 990).toLocaleString()}`
                : "?댁꽭瑜??좏깮?섏꽭??}
            </button>
            <button onClick={() => setShowSelect(false)}
              style={{ width: "100%", marginTop: 10, padding: "12px 0", background: "transparent", color: "#9ca3af", border: "none", fontSize: 13, cursor: "pointer" }}>
              痍⑥냼
            </button>
          </div>
        </div>
      )}

      {/* 怨듭쑀 ???꾨씪?대쾭???ㅼ젙 ??"?앸뀈?붿씪 ?뺣낫 怨듦컻"瑜??꾨㈃ ?졖룹삤??誘몃━蹂닿린
          ?놁씠 ?대쫫+遺꾩꽍湲留?怨듭쑀??移쒓뎄媛 ???뺥솗???앸뀈?붿씪????蹂닿쾶 ?????덉쓬) */}
      {showShareModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowShareModal(false)}>
          <div style={{ background: "white", borderRadius: 20, padding: 22, maxWidth: 340, width: "100%" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 14px", color: "#1a1a2e" }}>?뱾 怨듭쑀 ?ㅼ젙</h3>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#fdf2f8", borderRadius: 12, cursor: "pointer", marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>?앸뀈?붿씪 ?뺣낫 怨듦컻<br /><span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>?졖룹삤??誘몃━蹂닿린瑜?媛숈씠 蹂댁뿬以섏슂</span></span>
              <input type="checkbox" checked={shareIncludeBirth} onChange={e => setShareIncludeBirth(e.target.checked)} style={{ width: 20, height: 20, flexShrink: 0, marginLeft: 10 }} />
            </label>
            <button onClick={() => { setShowShareModal(false); share(); }} style={{ width: "100%", padding: 13, background: "linear-gradient(135deg, #ec4899, #8b5cf6)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer", marginBottom: 8 }}>
              怨듭쑀?섍린
            </button>
            <button onClick={() => setShowShareModal(false)} style={{ width: "100%", padding: 10, background: "transparent", color: "#9ca3af", border: "none", fontSize: 13, cursor: "pointer" }}>
              痍⑥냼
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes rsBadgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); box-shadow: 0 0 10px rgba(239,68,68,0.6); }
        }
        @keyframes qaSparkle {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </main>
    </>
  );
}
