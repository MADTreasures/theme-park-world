# the sources of the sound set (read by build_set.py). Every licence was read on the file's own page on Wikimedia Commons.
INTRO = ('Musik, Stimmengewirr, Lachen, Jubel und Applaus im Spiel sind echte Aufnahmen. Sie stammen alle von Wikimedia Commons und sind '
         'gemeinfrei oder von ihren Urhebern ohne Bedingungen freigegeben (CC0 1.0 oder gleichwertige Erklärung): Bearbeiten, Weitergeben und '
         'kommerzielle Nutzung sind ohne Namensnennung erlaubt. Die Lizenz wurde bei jeder Datei auf ihrer Seite bei Wikimedia Commons geprüft. '
         'Bei Musik ist zusätzlich angegeben, warum auch die Komposition frei ist. Die Liste wird aus audio/manifest.json erzeugt (node build.js) '
         'und steht auch im Spiel: Parkbüro → «Musik und Geräusche: Quellen».')
OUTRO = """## Geprüft, aber nicht verwendet

- **BigSoundBank / LaSonothèque (Joseph Sardin, bigsoundbank.com):** alle Geräusche dort stehen unter CC0, darunter echte Aufnahmen aus einem Freizeitpark – Schreie in Achterbahnen (Nr. 1453–1460), im Kettenkarussell (Nr. 1462) und in einer Wildwasserbahn (Nr. 1461) – sowie Menschenmengen im Freien (Nr. 2968–2970, 3094–3096). Die Seite schliesst aber den automatischen Abruf ihrer Tondateien durch Roboter und KI ausdrücklich aus (robots.txt und ai.txt). Die Dateien wurden deshalb nicht geladen. Wer sie von Hand herunterlädt, darf sie frei verwenden; sie lassen sich mit den Werkzeugen in tools/audio einbauen.
- **OpenGameArt (opengameart.org):** dort gibt es laut den Seiten der Stücke passende Musik unter CC0 («Carnival Rides» von Écrivain, «Children's March Theme» von CleytonKauffman, «Entry of the Gladiators» von Eldritch Grim). Die Seite untersagt KI-Agenten in ihrer robots.txt jeden Zugriff; nichts davon ist im Spiel.
- **Wikimedia Commons, wegen der Lizenz ausgelassen** (Namensnennung oder Weitergabe unter gleichen Bedingungen): Geräuscharchiv «Geluid van Nederland» des Instituts Beeld en Geluid (geprüfte Datei: CC BY-SA 3.0), Aufnahmen aus dem Wiener Prater der Aktion «Wie klingt Wien» (CC BY-SA 4.0), «Small group laughter», «Giggle», «Boy giggle», «Four Years Old child laughing» (CC BY 3.0), «Carl Frei kermisorgel» (CC BY-SA 3.0), «Scream-c.wav» (CC BY-SA 4.0), Freifallturm-Video aus dem Heide-Park (CC BY-SA 3.0 DE).
- **Wikimedia Commons, wegen möglicher fremder Musik ausgelassen:** «La fête foraine» (Rummelplatz in Toulouse, pdsounds.org) und «Orgue de barbarie» (Drehorgel in Paris, pdsounds.org) sind als Aufnahmen gemeinfrei; welche Musik darin zu hören ist, liess sich nicht klären.
- **Aufnahme der United States Marine Band** (Galopp aus Offenbachs «Geneviève de Brabant», auf Wikimedia Commons): laut Dateiseite als Werk der US-Bundesregierung gemeinfrei; ausserhalb der USA ist das nicht ausdrücklich geregelt. Sie wäre eine mögliche Ergänzung für die schnellen Fahrgeschäfte, ist aber nicht im Spiel. Dort liegt auch «Entrance of the Gladiators» derselben Kapelle; diese Seite wurde nicht geprüft."""
source('walzer', 'wm-street-organ-waltz',
    title='Drehorgel spielt den Schlittschuhläufer-Walzer («Street organ playing a waltz»)',
    author='Nacasma (Wikimedia Commons), eigene Aufnahme vom 24. August 2014 im historischen Zentrum von Mexiko-Stadt',
    licence='Gemeinfrei: vom Urheber ohne Bedingungen freigegeben, auf der Dateiseite als «Public Domain / CC0 1.0» ausgewiesen', licenceUrl=CC0_URL,
    composition='Émile Waldteufel (1837–1915), «Les Patineurs» (Schlittschuhläufer-Walzer) op. 183 von 1882 – gemeinfrei',
    url=wm('Street_organ_playing_a_waltz.ogg'), file='https://upload.wikimedia.org/wikipedia/commons/a/a6/Street_organ_playing_a_waltz.ogg',
    use='Musik am Karussell und an den ruhigen Fahrgeschäften')
source('angot', 'wm-polyphon-angot',
    title='Spieluhr Polyphon: Polka aus «La fille de Madame Angot»',
    author='Harke (Wikimedia Commons), eigene Aufnahme einer Polyphon-Lochplatte von etwa 1890',
    licence=CC0, licenceUrl=CC0_URL,
    composition='Charles Lecocq (1832–1918), Operette «La fille de Madame Angot» von 1872; Lochplatte der Polyphon-Musikwerke Leipzig um 1890 – gemeinfrei',
    url=wm('Polyphon_-_Angot_Polka_(Charles_Lecocq).ogg'), file='https://upload.wikimedia.org/wikipedia/commons/0/04/Polyphon_-_Angot_Polka_%28Charles_Lecocq%29.ogg',
    use='Musik am Karussell und an den ruhigen Fahrgeschäften')
source('kreuz', 'wm-polyphon-kreuz',
    title='Spieluhr Polyphon: Kreuz-Polka',
    author='Harke (Wikimedia Commons), eigene Aufnahme einer Polyphon-Lochplatte von etwa 1890',
    licence=CC0, licenceUrl=CC0_URL,
    composition='Kreuzpolka, überlieferter Tanz des 19. Jahrhunderts; Lochplatte der Polyphon-Musikwerke Leipzig um 1890 (Urheber laut Dateiseite unbekannt und seit über 70 Jahren tot) – gemeinfrei',
    url=wm('Polyphon_-_Kreuz-Polka.ogg'), file='https://upload.wikimedia.org/wikipedia/commons/c/ca/Polyphon_-_Kreuz-Polka.ogg',
    use='Musik am Karussell und an den ruhigen Fahrgeschäften')
source('blumen', 'wm-polyphon-blumen',
    title='Spieluhr Polyphon: Blumen-Polka',
    author='Harke (Wikimedia Commons), eigene Aufnahme einer Polyphon-Lochplatte von etwa 1890',
    licence=CC0, licenceUrl=CC0_URL,
    composition='Blumen-Polka; Lochplatte der Polyphon-Musikwerke Leipzig um 1890 (Urheber laut Dateiseite unbekannt und seit über 70 Jahren tot) – gemeinfrei',
    url=wm('Polyphon_-_Blumen-Polka.ogg'), file='https://upload.wikimedia.org/wikipedia/commons/0/0a/Polyphon_-_Blumen-Polka.ogg',
    use='Musik am Karussell und an den ruhigen Fahrgeschäften')
source('lachen', 'wm-laughters',
    title='Mehrere Lacher, Kichern und Glucksen («Laughter(s)»)',
    author='sagetyrtle (Freesound Nr. 33658), nach Wikimedia Commons übertragen von Racconish',
    licence=CC0, licenceUrl=CC0_URL,
    url=wm('Laughter(s).ogg'), file='https://upload.wikimedia.org/wikipedia/commons/c/cb/Laughter%28s%29.ogg',
    use='einzelne Lacher von Besucherinnen und Besuchern (16 verschiedene, im Wechsel)',
    note='Die Lizenz steht so auf der Dateiseite bei Wikimedia Commons. Die ursprüngliche Seite bei Freesound (https://freesound.org/people/sagetyrtle/sounds/33658/) sperrt automatische Abrufe und konnte deshalb nicht zusätzlich geprüft werden.')
source('prusten', 'wm-bursting-out',
    title='Losprusten («Bursting out laughing»)', author='ezwa (pdsounds.org Nr. 138), nach Wikimedia Commons übertragen von Fæ',
    licence=PD_PDSOUNDS, url=wm('Bursting_out_laughing.ogg'), file='https://upload.wikimedia.org/wikipedia/commons/5/51/Bursting_out_laughing.ogg',
    use='einzelne Lacher von Besuchern')
source('gelaechter', 'wm-laughter-ezwa',
    title='Gelächter («Laughter»)', author='ezwa (pdsounds.org Nr. 137), nach Wikimedia Commons übertragen von Fæ',
    licence=PD_PDSOUNDS, url=wm('Laughter.ogg'), file='https://upload.wikimedia.org/wikipedia/commons/c/c6/Laughter.ogg',
    use='einzelne Lacher von Besuchern')
source('raeuspern', 'wm-laughter-clearing',
    title='Lachen und Räuspern («Laughter and clearing voice»)', author='ezwa (pdsounds.org Nr. 448), nach Wikimedia Commons übertragen von Fæ',
    licence=PD_PDSOUNDS, url=wm('Laughter_and_clearing_voice.ogg'), file='https://upload.wikimedia.org/wikipedia/commons/e/ef/Laughter_and_clearing_voice.ogg',
    use='einzelne Lacher von Besuchern')
source('maedchen', 'wm-girl-laughing',
    title='Kurzes Lachen einer Frau («Short clip of girl laughing»)', author='lmbubec (Freesound), nach Wikimedia Commons übertragen von Mx. Granger; Lizenz dort von einem Prüfer bestätigt',
    licence=CC0, licenceUrl=CC0_URL, url=wm('Short_clip_of_girl_laughing.wav'), file='https://upload.wikimedia.org/wikipedia/commons/f/f4/Short_clip_of_girl_laughing.wav',
    use='einzelne Lacher von Besucherinnen')
source('publikum', 'wm-lachkonserve',
    title='Gelächter von Publikum («Lachkonserve 1»)', author='Sleepytomcat (Jens Kraglund), von der deutschsprachigen Wikipedia nach Wikimedia Commons übertragen',
    licence='Gemeinfrei: vom Urheber ohne Bedingungen freigegeben («released into the public domain by its author»)',
    url=wm('Lachkonserve_1.ogg'), file='https://upload.wikimedia.org/wikipedia/commons/f/f9/Lachkonserve_1.ogg',
    use='gemeinsames Lachen einer Gruppe auf belebten Wegen')
source('hurra', 'wm-hurray',
    title='Hurra-Rufe («Hurray»)', author='starlite (pdsounds.org Nr. 44), nach Wikimedia Commons übertragen von Fæ',
    licence=PD_PDSOUNDS, url=wm('Hurray.ogg'), file='https://upload.wikimedia.org/wikipedia/commons/e/e8/Hurray.ogg',
    use='Jubel bei Abfahrten und auf wilden Fahrgeschäften')
source('klatschen', 'wm-clapping-hurray',
    title='Klatschen und Jubelrufe («Clapping hurray»)', author='starlite (pdsounds.org Nr. 38), nach Wikimedia Commons übertragen von Fæ',
    licence=PD_PDSOUNDS, url=wm('Clapping_hurray.ogg'), file='https://upload.wikimedia.org/wikipedia/commons/a/a8/Clapping_hurray.ogg',
    use='Jubel bei Abfahrten und Applaus nach den Vorstellungen')
source('schrei', 'wm-unclesigmund',
    title='Schrei «ahhh» («UncleSigmund - ahhh»)', author='UncleSigmund (Freesound), nach Wikimedia Commons übertragen von ComputerHotline',
    licence=CC0, licenceUrl=CC0_URL, url=wm('UncleSigmund_-_ahhh_(cc0)_(freesound).mp3'), file='https://upload.wikimedia.org/wikipedia/commons/3/32/UncleSigmund_-_ahhh_%28cc0%29_%28freesound%29.mp3',
    use='Schrei bei Abfahrten')
source('festival', 'wm-festival-crowd',
    title='Menschenmenge vor einem Festival-Konzert («Festival concert people crowd»)', author='stephan (pdsounds.org Nr. 300), nach Wikimedia Commons übertragen von Fæ',
    licence=PD_PDSOUNDS, url=wm('Festival_concert_people_crowd.ogg'), file='https://upload.wikimedia.org/wikipedia/commons/1/15/Festival_concert_people_crowd.ogg',
    use='Stimmengewirr auf belebten Wegen')
source('cancan', 'wm-cancan',
    title='Cancan aus der Ouvertüre zu «Orpheus in der Unterwelt»',
    author='Musopen (gemeinnützige US-Organisation, Aufnahme «Famous overtures no. 3»), nach Wikimedia Commons übertragen von Morn',
    licence='Gemeinfrei: vom Urheber ausdrücklich freigegeben («released explicitly into the public domain by its author», Creative Commons Public Domain Dedication); jede Nutzung einschliesslich Bearbeitung und kommerzieller Weitergabe ist erlaubt',
    licenceUrl='https://web.archive.org/web/20230926203737/https://creativecommons.org/licenses/publicdomain/',
    composition='Jacques Offenbach (1819–1880), «Orphée aux enfers» von 1858; die Ouvertüre mit dem Cancan stellte Carl Binder (1816–1860) für Wien 1860 zusammen – gemeinfrei',
    url=wm('Offenbach_-_Orpheus_in_the_Underworld_-_Overture,_Can_Can_section.ogg'), file='https://upload.wikimedia.org/wikipedia/commons/6/63/Offenbach_-_Orpheus_in_the_Underworld_-_Overture%2C_Can_Can_section.ogg',
    use='lebhafte Musik an den schnellen Fahrgeschäften',
    note='Die Freigabe erfolgte mit der älteren «Public Domain Dedication» von Creative Commons, dem Vorläufer von CC0; die Dateiseite weist darauf hin, dass dieses Werkzeug inzwischen durch CC0 ersetzt ist. Musopen verlangt von allen Einsendern die Zusicherung, dass die Aufnahmen gemeinfrei sind.')
source('junge', 'wm-now-screaming',
    title='Langer Schrei eines Jungen («NOW screaming»)', author='Ranch9613 (Wikimedia Commons), eigene Aufnahme vom 5. November 2019',
    licence=CC0, licenceUrl=CC0_URL, url=wm('NOW_screaming.ogg'), file='https://upload.wikimedia.org/wikipedia/commons/0/0d/NOW_screaming.ogg',
    use='Schreie bei Abfahrten')
source('ohhh', 'wm-ohhh-ahhh',
    title='Ein paar Leute rufen «Ohhh» und «Ahhh» («Ohhh ahhh»)', author='starlite (pdsounds.org Nr. 47), nach Wikimedia Commons übertragen von Fæ',
    licence=PD_PDSOUNDS, url=wm('Ohhh_ahhh.ogg'), file='https://upload.wikimedia.org/wikipedia/commons/0/0f/Ohhh_ahhh.ogg',
    use='Jubel bei Abfahrten und auf wilden Fahrgeschäften')
source('schulfest', 'wm-applause-i',
    title='Applaus bei einer Schulfeier («Applause I»)', author='thore (pdsounds.org Nr. 406), nach Wikimedia Commons übertragen von Fæ',
    licence=PD_PDSOUNDS, url=wm('Applause_i.ogg'), file='https://upload.wikimedia.org/wikipedia/commons/5/5b/Applause_i.ogg',
    use='Applaus nach den Vorstellungen')
