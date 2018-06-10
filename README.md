# Semestrální práce do předmětu KAJ - FEL ČVUT

## Cíl práce

Vytvořit 2D celulární simulátor Game of Life využívající standardní sadu pravidel. Více o celulárních simulátorech najdete v [nápovědě této aplikace](https://vitvalecka.github.io/fel-kaj-semestral/help.html), nebo na [Wikipedii](https://cs.wikipedia.org/wiki/Hra_života).

## Aplikace

Aplikace je online k dispozici zde: https://vitvalecka.github.io/fel-kaj-semestral/

## Postup

Game of Life jsem psal již několikrát v různých jazycích (Pascal/Delphi, C++/Qt, Java, .NET), proto jsem se rozhodl začít již odzkoušeným kódem a postupně převádět jednotlivé části, dokud nezískám kompletní program, nad kterým můžu dále stavět.

Jako další přišla na řadu variabilní velikost canvasu, ta je řešena tak, že se program nejdříve podívá na rozměry nadřazeného elementu a podle toho zjistí, kolik prostoru má k dispozici. Podle toho a požadovaného počtu sloupců a řádků zvolí vhodnou velikost buněk tak, aby byly čtvercové.

Druhé v pořadí bylo implementováno generování náhodného hracího plánu, které je principielně velmi jednoduché a bylo také doplněno nastavení pro rychlost animace (nastavení FPS).

Jako poslední funkcionalita byl implementován drag'n'drop pro textové soubory s předpisem mapy. Zde byla implementace obtížnější.

V průběhu testování jsem pak pro zkrácení dlouhé chvíle poslouchal hudbu, a tak jsem se rozhodl do aplikace přidat ještě přehrávač. Ten je implementován za pomoci [jQuery Audio Player](https://amazingaudioplayer.com).

## Popis funkčnosti a návod

### Základní ovládání

**Síť pro buňky** - Jedná se o čtvercovou síť, do které lze kliknutím levého tlačítka myši přidávat (nebo ubírat) živé buňky. Živá buňka má černou barvu, mrtvá bílou. Opakovaným klikáním na jednu buňku lze cyklovat mezi stavem živá/mrtvá.

**Start (tlačítko)** - Spustí automatický běh simulace s v nastavení zadanou frekvencí kroků za vteřinu. Je li spuštěna simulace, tlačítko se změní na "Stop".

**Stop (tlačítko)** - Pozastaví simulaci na aktuálním kroku až do opětovného spuštění pomocí tlačítka "Start" nebo "Jeden krok". Po zastavení simulace se tlačítko změní na "Start".

**Jeden krok (tlačítko)** - Místo spuštění automatického běhu simulace provede vyhodnocení a vykreslení pouze jednoho (následujícího) kroku.

**Vygeneruj náhodné pole (tlačítko)** - Náhodně rozmístí po aktuálním plánu živé a mrtvé buňky.

### Vložení vlastního souboru s mapou

Aplikace umožňuje přetažení vlastního textového souboru s mapou do vyznačené oblasti, čímž dojde k nahrání této mapy a jejímu zobrazení. Na takto nahrané mapě lze provádět simulace.

Tento textový soubor ale musí mít určitý formát. Konkrétně:

* na prvním řádku se nachází celé číslo udávající počet sloupců
* na druhém řásku se nachází celé číslo udávající počet řádků
* následují řádky reprezentující jednotlivé řádky mapy - na každém řádku je sekvence 0 a 1 reprezentujících mrtvé (0) a živé (1) buňky (nejsou odděleny mezeramy, následují bezprostředně po sobě)
* jednotlivé řádky mapy odpovídají řádkům nul a jedniček v souboru

Níže přikládáme několik ukázkových souborů:

* [Benátské rolety](https://github.com/vitvalecka/fel-kaj-semestral/blob/master/demo-maps/benatske-rolety.txt)
* [Blikač](https://github.com/vitvalecka/fel-kaj-semestral/blob/master/demo-maps/blikac.txt)
* [Králíci](https://github.com/vitvalecka/fel-kaj-semestral/blob/master/demo-maps/kralici.txt)
* [Maják](https://github.com/vitvalecka/fel-kaj-semestral/blob/master/demo-maps/majak.txt)
* [R-pentomino](https://github.com/vitvalecka/fel-kaj-semestral/blob/master/demo-maps/r-pentomino.txt)
* [Ropucha](https://github.com/vitvalecka/fel-kaj-semestral/blob/master/demo-maps/ropucha.txt)
* [Žalud](https://github.com/vitvalecka/fel-kaj-semestral/blob/master/demo-maps/zalud.txt)

### Nastavení

**Rozměry pole** - Zde lze nastavit rozměry vykreslované mapy - konkrétně pak její šířku (počet sloupců) a výšku (počet řádků). Po nastavení požadované velikosti je nutné kliknout na tlačítko "Překresli mapu". Pozor! Kliknutím na toto tlačítko dojde ke smazání celé mapy a bude třeba ji vytvořit znovu!  
   Minimální velikost je 5x5, maximální pak 200x200.

**Rachlost animace (FPS)** - Zde lze nastavit kolik kroků proběhne za jednu vteřinu během automatického běhu programu. Při reálném běhu bude počet provedených kroků za vteřinu menší nebo roven tomuto číslu - v případě velkých map může být výpočetní náročnost příliš velká na to, aby bylo možné udržet požadovanou frekvenci.
Minimální rychlost je 0,1 (1 snímek za 10 sekund), maximální pak 30 kroků/s.

### Přehrávač

Zpříjemněte si své "buněčné hrátky" trochou hudby. Jako podkresová hudba je k dispozici několik skladeb! SStačí si vybrat v přehrávači po sekcí Nastavení. Je možné přehrávání pauzovat, skočit na následující/předchozí skladbu, nechat hudbu hrát v nekonečné smyčce...
