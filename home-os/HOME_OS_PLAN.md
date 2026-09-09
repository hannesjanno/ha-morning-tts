# Home OS — plaan, otsused ja 3D mudeli võtmekohad

_Uuendatud: 2026-09-08_

See dokument koondab Home OS projekti senise plaani, kokkulepitud disainiotsused, 3D mudeli ehituse põhimõtted, fotode põhjal tehtud valikud ning järgmised tööd. Eesmärk on, et edasistes muudatustes oleks üks püsiv lähtekoht ja juba kinnitatud lahendusi kogemata tagasi ei muudeta.

## 1. Projekti eesmärk

Home OS on Home Assistanti ümber ehitatud kodu juhtimise kasutajaliides. Suund on puhas, tume ja Tesla-laadne UI, kus on koos tavapärased dashboardid ning maja 2D/3D visualiseerimine. 3D vaade peab muutuma järk-järgult päris kodu digitaalseks mudeliks: õiged ruumid, seinad, aknad, põrandad, mööbel ja hiljem seadmete/olekute visualiseerimine.

Põhimõte: fotod ja päris maja paigutus on 3D mudeli visuaalse tõe allikas. Kui foto ja varasem lihtsustatud 3D detail lähevad vastuollu, tuleb mudelit parandada foto järgi, säilitades samal ajal juba kinnitatud geomeetria seal, kus uut infot pole.

## 2. Repo ja töövoog

- Repo: `hannesjanno/ha-morning-tts`
- Home OS asub kataloogis `home-os/`.
- Aktiivne tööbranch: `home-os`.
- `main` peab jääma puutumata, kuni kasutaja eraldi teisiti otsustab.
- Aktiivne Three.js 3D vaade: `home-os/src/floor3DViewer.js`.
- Aktiivse trepi lõplik geomeetria asendatakse failis `home-os/src/stairs3DOverride.js`; trepimuudatusi tuleb teha eelkõige seal.
- `home-os/src/floor3DOverlay.js` on vana lahendus ja ei ole aktiivse 3D vaate alus.
- `home-os/src/main.jsx` paigaldab 3D vieweri.
- Three.js on projektis juba olemas; tavapärase muudatuse järel ei ole vaja `npm install` käivitada.

Kohalik kontroll:

```cmd
cd C:\Users\Hannes\ha-morning-tts
git checkout home-os
git pull
cd home-os
npm run dev
```

Seejärel brauseris `Ctrl+F5`.

### Commiti reegel

Repo muudatuse järel tuleb commit GitHubist eraldi üle kontrollida. Kasutajale tohib anda ainult tegelikult olemas oleva ja kontrollitud commit SHA. SHA-d ei tohi oletada ega välja mõelda.

## 3. 2D plaan

2D geomeetria ja sisustus on varasemates etappides suuresti paika saadud. Teine korrus on samuti valmis. Neid ei muudeta ilma konkreetse vajaduseta. Praegune põhirõhk on esimese korruse 3D vaate realistlikumaks muutmisel.

## 4. 3D vaate tehniline alus

Aktiivne viewer kasutab Three.js-i ja muu hulgas:

- `OrbitControls`
- `RoundedBoxGeometry`
- oma abifunktsioone nagu `addBox`, `addRoundedBox`, `addCylinder`, `addRod`, `addFloor`, `addWall`, `addWindow`
- detailseid funktsioone trepi, köögi, diivani ja kamina jaoks

Plaanikoordinaadid teisendatakse 3D maailma skaalaga `SCALE = 0.01`.

Oluline tehniline reegel: vältida coplanar-pindu. Kui kaks Three.js pinda asuvad praktiliselt samal tasapinnal, tekib kaamera liigutamisel z-fighting ehk vilkumine. Dekoratiivsed pinnad tuleb kas füüsiliselt mõni millimeeter ettepoole nihutada või kasutada sobivat `polygonOffset` lahendust.

## 5. Seinad

Fotode põhjal on seinte üldtoon soe hele greige / murdvalge, mitte külm puhas valge ega hall. 3D mudeli seinavärv peab järgima seda sooja neutraalset üldmuljet.

## 6. Põrandad

### 6.1 Elutuba

Elutoas on päriselt hele naturaalne tammeparkett.

Kinnitatud omadused fotode põhjal:

- hele naturaalne tamm;
- kergelt beežikas/greige, mitte hall ega tugevalt kollane;
- matt pind;
- rahulik ja peen puidusüü;
- nähtavad, kuid tagasihoidlikud tumedamad oksakohad;
- erineva pikkusega laudade otsavuugid;
- laudade põhisuund on plaanil vertikaalne;
- see parketimaterjal kuulub ainult elutuppa.

Elutoa põrand ei tohi ulatuda õue ega terrassile.

### 6.2 Köök ja esik

Köögis ja esikus ei ole sama parkett mis elutoas. Seal tuleb kasutada kasutaja 2026-09-08 lähifotol näidatud puiduimitatsiooniga põrandaplaati.

Põrandaplaadi visuaal:

- pikk kitsas puidulauda meenutav plaat;
- hele soe tamm / beež tamm;
- elutoa parketist veidi ühtlasem ja plaadilikum pind;
- peen puidusüü;
- selgelt loetavad pikad vuugid ja nihkes otsavuugid;
- matt kuni väga kerge satiin;
- üldmulje peab sobima heleroheliste köögikappidega.

Köök ja esik peavad saama sama plaadimaterjali ning elutoa parkett peab jääma eraldi materjaliks.

**Staatus:** see on järgmine põrandamuudatus, mis tuleb `floor3DViewer.js`-is lõpuni realiseerida.

## 7. Elutuba

### 7.1 Diivan

Diivan on fotode järgi ümber modelleeritud ja kasutaja kinnitas, et diivan on korras. Diivanit ei muudeta ilma uue konkreetse soovita.

Tegemist on suure heleda L-/nurgadiivaniga, mis jookseb mööda seina ning pöördub toa sisse.

### 7.2 Vaip

Vaip on fotol hele kreemikas/beež kõrge karvaga vaip, millel on tumedad ebakorrapärased romb-/võrejooned.

Kinnitatud paigutus:

- vaip on pööratud nii, et selle pikk telg jookseb diivani juurest teleka suunas;
- vaip paikneb vastu diivani-poolset seina;
- vaiba laius on umbes diivani laiune;
- viimane kasutatud laius mudelis on umbes 286 plaaniühikut.

### 7.3 Telekas ja TV-alus

Telekas on Sony Bravia 65".

Foto järgi:

- TV paikneb suure klaasosa/terrassiukse kõrval;
- ekraan peab olema 65" teleri proportsioonidega;
- TV all on kõrge, kitsam mööbliese, mitte madal lai TV-kapp;
- TV-aluse kapiosa on soe puidutoon;
- raam ja jalad on tumedad/mustad;
- TV-alus ei tohi olla üleni must.

### 7.4 Elutoa aknad / klaasosa

Elutoa suure klaasosa mõõdud on kasutaja hinnangul õigeks saadud.

Kinnitatud visuaal:

- suured põrandani ulatuvad klaaspinnad;
- raamid on valged/heledad;
- klaas peab olema visuaalselt tume/mustjas, mitte hele sinakas;
- klaas peab siiski mõjuma klaasina, mitte läbipaistmatu musta seinaplaadina.

## 8. Söögiala elutoas

Fotol on kamina ja suure akna vahel ümmargune valge söögilaud.

Kinnitatud detailid:

- ümmargune valge lauaplaat;
- valge keskne/pjedestaaljalg;
- neli helebeeži/taupe polsterdatud tooli;
- toolidel tumedad peened jalad;
- toolid paiknevad laua ümber neljas suunas;
- proportsioonid ja paigutus peavad jätma liikumisruumi akna ja kamina juurde.

## 9. Kamin

Kamin on kõrge minimalistlik valge korpus elutoa ja kõrvalala piiril.

Kinnitatud detailid:

- kamina orientatsioon on paika saadud ja seda ei muudeta ilma uue soovita;
- orientatsioonikoodis on kasutatud `3 * Math.PI / 2`;
- must tulekolle ei tohi ulatuda korpusest suure kastina välja;
- must klaas on U-kujuline: esiklaas + mõlemad külgklaasid;
- klaas on must/tume ja nähtav;
- klaaspinnad on kehast vaid mõne millimeetri võrra ees, et vältida z-fighting'ut;
- üleliigset tumbat või eraldi kasti kamina ees ei ole;
- ülemine ja alumine tume ventilatsioonidetail on õhuke.

Kamina z-fighting parandati füüsilise väikese nihke ja `polygonOffset` abil.

## 10. Köök

Köögi põhiline kuju ja värvilahendus tuleb säilitada fotode järgi.

### 10.1 Alumised ja kõrged kapid

- põhilised kapifassaadid on summutatud helerohelised / salveirohelised;
- töötasapind on soe puidutoon;
- kõrge roheline kapiplokk asub paremal;
- mustad integreeritud ahjud/seadmed paiknevad kõrges kapiosas;
- kapifassaadidel on klassikaline raam-/paneeldetail;
- dekoratiivsed rohelised esipaneelid ei tohi olla põhikapi pinnaga coplanar, sest see põhjustab vilkumist.

Köögi roheliste kappide z-fighting on juba parandatud, nihutades esipaneele veidi ettepoole ja kasutades `polygonOffset`-i.

### 10.2 Pliidi kohal olev ülemine osa

Kasutaja foto järgi ei ole pliidi kohal tavaline roheline seinakapp.

Kinnitatud lahendus:

- pliidi kohal on valge ülemine kapp / integreeritud kubukapp;
- alumises servas on tume õhupuhasti/kubu detail;
- valgete ülemiste kappide rida peab jooksma visuaalselt katkematult kubukapini;
- valge nurgakapi ja kubukapi vahele ei tohi jääda tühimikku;
- kõrge roheline kapp jääb paremale alles.

Tühimik valgete ülemiste kappide vahel parandati commitis `cdbbc6ca18b5704d71a330f4f45498c5c1311847`.

### 10.3 Muud fotol nähtavad köögidetailid

Foto annab edasiseks täpsustamiseks järgmised referentsid:

- akna all kraanikauss;
- must/tume pliidiplaat parempoolsel töötasapinnal;
- kohvimasin vasakul;
- kitsas valge avatud veiniriiul vasakul ülal;
- valged ülemised kapid akna/pliidiala lähedal;
- köögis on puidutoonis söögilaud ja tumedad toolid (eraldi köögiala foto järgi).

Kõiki väikeseadmeid ei pea kohe modelleerima; prioriteet on ruumi ja suurte elementide õige kuju.

## 11. Trepp

Trepp on 2026-09-08 fotode põhjal detailsemaks tehtud. Olemasolevat trepi lahendust ei muudeta ilma konkreetse vajaduseta.

Kinnitatud detailid:

- trepp on U-kujuline ja koosneb kahest paralleelsest sirgest trepijooksust;
- seina juures toimub pööre lehvik-/pöördastmetega, mitte ristkülikukujulise vaheplatvormiga;
- astmed on avatud konstruktsiooniga varasemalt kinnitatud soojas naturaalses puidutoonis;
- piirded, tugipostid, kandekonstruktsioon ja balustrid on varasemalt kinnitatud soojas murdvalges toonis;
- väliskäsipuud kasutavad astmetega sama varasemalt kinnitatud puidutooni;
- 2026-09-09 näidispildilt võetakse ainult trepi kuju ja ehitusloogika, mitte värve;
- Täiendav geomeetriareferents: [Sketchfab — 25_I_Riik](https://sketchfab.com/3d-models/25-i-riik-19cc207903a94554ac5a3e5b6b5aea64), Stairconi eksport autorilt Andris Sild / Andu Trepp. Referentsist kasutatakse ainult trepi ehitusloogikat; mudelifaili tohib projekti importida alles siis, kui on olemas allalaaditav GLB/GLTF ja selge kasutusõigus.
- trepi pöördeosa on vastu seina: pöördes ei ole välimist kaarpiiret ega sisemist jagajapiiret;
- mõlema sirge trepijooksu keskpoolne külg on avatud — seal ei ole käsipuud, balustreid ega otsaposte; piire jääb ainult trepi välisküljele;
- ülemise jooksu seinaäärne käsipuu on sirge ja kinnitub lühikeste kronsteinidega otse seinale; see ei jätku pöördes kaarena;
- sirgetel astmetel on beežid poolümarad astmematid;
- pöördastmetel järgivad beežid matid lehvikastmete kuju;
- trepi asukohta ja varem kinnitatud U-kujulist põhisuunda ei muudeta ilma uue konkreetse infota;
- mõlemad sirged trepijooksud on joondatud ning seinaäärne 180° pööre koosneb neljast kompaktsest hulknurksest pöördastmest; laia kaarjat pöördegeomeetriat ei kasutata.

Aktiivse fotopõhise trepiversiooni lähtekoht on commit `31e23bf9aec781c67709be7ea30c0cafba77dbb7`. Aktiivse `stairs3DOverride.js` välimine kaarpiire, sisemine jagajapiire ja trepijooksude keskpiirded eemaldati commitis `6970c0c9193d677bc3da68ab6c7a1913b6230d4b`. Varasem kinnitatud värv taastati commitis `3ea56f89360111d99c623640e4cc9920c1225e0f`; kuju muudeti näidise järgi kompaktseks sirgete lendudega U-trepiks commitis `8bc558649601e48d1472d9355c6f1130430d510e`.

## 12. Laed — kavandatud lahendus

Laed ei ole veel lõplikult realiseeritud, kuid kokkulepitud suund on **smart ceiling**:

- ruumidel on hele matt lagi, et tavavaade tunduks päris interjöörina;
- tavalisel madalamal/interjöörikaameral on lagi nähtav;
- kõrge ülaltvaate korral peab lagi automaatselt peituma või muutuma piisavalt läbipaistvaks, et maja sisemus jääks kasutatavaks;
- eesmärk ei ole muuta mudelit kinniseks kastiks.

Fotodel on elutoas ja köögis näha ka päris valgusteid. Valgustid on hilisem detailikiht pärast põhilise geomeetria ja materjalide kinnitamist.

## 13. Modaalid ja UI

Varasemalt oli probleem, et modaalid avanesid ekraani paremas osas. Kinnitatud soov on, et modaalid avaneksid visuaalselt **ekraani keskel**.

Home OS üldine visuaalne suund jääb tumedaks, puhtaks ja Tesla-laadseks, kuid 3D maja materjalid peavad järgima päris kodu fotosid, mitte UI tumedat värvipaletti.

## 14. Asjad, mida ei tohi regressioonina tagasi tuua

- Elutoa parketti ei tohi panna õue/terrassile.
- Elutoa parkett ei tohi automaatselt katta kööki ja esikut.
- TV-alus ei tohi muutuda üleni mustaks.
- Elutoa klaasid ei tohi muutuda helesiniseks üldiseks Three.js aknaklaasiks; need on tumedamad/mustjad, valgete raamidega.
- Kaminaklaas ei tohi ulatuda suure musta kastina kaminast välja.
- Kaminaklaas peab jääma U-kujuliseks.
- Kamina ette ei lisata tumbat.
- Kamina kinnitatud orientatsiooni ei muudeta.
- Köögikappide dekoratiivseid paneele ei asetata coplanar-pinnale.
- Pliidi kohal ei kasutata rohelist tavalist seinakappi; seal on valge kubukapp.
- Valgete ülemiste kappide vahele ei jäeta tühimikku.
- Diivanit ei muudeta ilma konkreetse soovita.
- `main` branchi ei muudeta Home OS iteratsioonide käigus.

## 15. Järgmised tööd

Prioriteetide järjekord praeguse seisuga:

1. **Köögi ja esiku põrand** — luua foto järgi eraldi hele puiduimitatsiooniga põrandaplaadi materjal ning rakendada ainult köögile ja esikule.
2. Kontrollida 3D-s köögi värskelt parandatud ülemiste kappide/kubukapi tervikut.
3. Jätkata elutoa akende ja TV/TV-aluse visuaalset täpsustamist ainult siis, kui kasutaja ülevaatus näitab vajadust.
4. Vaadata üle söögilaua ja nelja tooli mõõdud/asukohad.
5. Lisada smart ceiling lahendus.
6. Pärast põhigeomeetria kinnitamist lisada valgustid ja muud väiksemad interjööridetailid.
7. Hiljem siduda 3D objektid Home Assistanti päris olekutega, kui visuaalne mudel on piisavalt stabiilne.

## 16. Töömeetod edaspidiseks

Iga foto-põhise muudatuse korral:

1. võrrelda uut fotot olemasoleva `floor3DViewer.js` geomeetriaga;
2. muuta ainult neid elemente, mille kohta foto annab parema info;
3. säilitada kasutaja poolt juba kinnitatud detailid;
4. vältida z-fighting'ut ja kattuvaid pindu;
5. commitida `home-os` branchi;
6. kontrollida commit GitHubist;
7. alles siis anda kasutajale kontrollitud SHA.

See dokument on projekti elav lähtepunkt ja seda tuleks oluliste uute kinnitatud otsuste järel uuendada.