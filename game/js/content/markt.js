/* ===== M. Adventure – content/markt.js =====
   Markt: Mara (S04, S07, S16, S24, S27), Dedo (S08–S13, S20), Werbeszene (S21), Wechselgespräche Mara/Dedo (IX). */
(function(MA){
'use strict';
var K = MA.ART.markt.K;
function F(k){ return MA.flag(k); }

// ---------------------------------------------------------------- Mara
async function maraTalk(A){ var Ma = A.npc('mara');
  if (!F('mara.met')){
    if (!A.has('auftrag')){ await Ma.say('Schulmaterial gebe ich nicht einfach irgendeinem Jungen mit.'); await A.say('Ich bin nicht irgendeiner.'); await Ma.say('Das glaube ich dir. Jetzt brauche ich noch den Auftrag.'); return; }
    await Ma.say('Wer schickt dich?'); await A.say('Der Lehrer.'); await Ma.say('Zeig.'); await A.say('Branko hat auch ein Blatt.'); await Ma.say('Das hier hat eine Unterschrift. Wir bleiben bei diesem.');
    await A.wait(500); A.take('auftrag'); A.set('mara.met'); A.note('n_auftrag', 'done');
    await Ma.say('Das Schulmaterial liegt bereit. Und hier stehen die Getränke. Bei denen fehlt mir noch eine brauchbare Verpackung.'); await A.say('Die haben doch eine Kiste.'); await Ma.say('Eine Kiste trennt keine Flaschen voneinander.'); await A.say('Sie hält sie wenigstens zusammen.'); await Ma.say('Genau davor habe ich Angst.');
    await Ma.say('Zuerst das hier. Der adressierte Beutel. Für den Lehrer.'); await A.say('Ich weiß.'); await Ma.say('Nicht für Dedo, nicht für Dragan.'); await A.say('Ich wollte niemanden damit bewerfen.'); await Ma.say('Dann ist die Hälfte meiner Sorge erledigt.');
    A.give('beutel'); A.note('n_beutel'); A.save(); }
  await A.menu(function(){ return [
    { t: 'Was bekomme ich, wenn ich sie ordentlich packe?', if: !F('mara.job'), once: 'ma.a', go: async function(){ await Ma.say('Den vereinbarten Packlohn. Erst packst du, dann prüfe ich, dann bezahle ich.'); await A.say('Sehr viele Wörter für „ja“.'); await Ma.say('Es war auch noch kein Ja von dir.'); } },
    { t: 'Ich möchte eine leitende Stellung.', if: !F('mara.job'), once: 'ma.b', go: async function(){ await Ma.say('Gut. Du leitest zwölf Flaschen in ihre Plätze.'); await A.say('Habe ich Mitarbeiter?'); await Ma.say('Zwölf. Alle zerbrechlich.'); } },
    { t: 'Zeig mir, worauf ich achten muss.', if: !F('mara.job'), once: 'ma.c', go: maraRules },
    { t: 'Gut. Ich packe sie.', if: !F('mara.job'), go: async function(){ await A.say('Gut. Ich packe sie.'); await Ma.say('Zwanzig Dinar und drei Klammern. Zwölf Flaschen, eine Kiste, keine Scherben.'); await Ma.say('Karton kannst du haben. Was du daraus machst, ist deine Sache.');
        A.set('mara.job'); A.set('karton.given'); A.give('karton'); A.note('n_kiste'); MA.touch(); } },
    { t: 'Worauf muss ich noch mal achten?', if: F('mara.job') && !F('packed'), go: async function(){ await Ma.say('Jede Flasche ihr Platz. Keine schlägt gegen die nächste. Die Kiste geht zu.'); } },
    { t: 'Hast du noch ein Stück Karton?', if: F('mara.job') && !F('packed') && !A.has('karton') && !A.has('raster') && !A.has('einsatz'), go: async function(){ await Ma.say('Ein Stück. Das letzte, das ich verschenke.'); A.give('karton'); } },
    { t: 'Ich trage die Kiste zur Paradestraße.', if: F('packed') && !F('delivery.job'), go: deliveryAccept },
    { t: 'Gib mir die Kiste wieder. Die Sandale hält.', if: F('delivery.job') && !A.has('kiste') && !F('delivered') && F('sandal') === 'fixed' && !F('crate.carry'), go: sandalOk },
    { t: 'Kann ich das Netz schon haben?', if: F('delivery.job') && !F('delivery.done'), go: async function(){ await Ma.say('Erst schließen wir die Lieferung ab. Dann gehört dir der Lohn.'); } },
    { t: 'Hier sind Kiste und Schein.', if: F('delivered') && !F('delivery.done'), go: s27 },
    { t: 'Was hältst du von Dedo?', once: 'ma.dedo', go: async function(){ await Ma.say('Dedo verkauft Geschichten. Manchmal ist ein Gegenstand dabei.'); } },
    { t: 'Bis später.', bye: true }
  ]; }); }
async function maraRules(A){ var Ma = A.npc('mara'); await Ma.say('Jede Flasche braucht ihren Platz. Beim Tragen darf keine gegen die nächste schlagen. Die Kiste muss sich schließen lassen.'); await A.say('Verstanden.'); await Ma.say('Das höre ich gern. Sehen möchte ich es auch.'); }
// S07: Einsatz in die Kiste
async function pack(A){ var Ma = A.npc('mara'), De = A.npc('dedo');
  if (!F('mara.job')){ await Ma.say('Erst fragst du, dann packst du.'); return; }
  if (F('packed')){ await Ma.say('Die Kiste ist gepackt.'); return; }
  await A.anim('reachL'); A.take('einsatz'); await A.say('Einsatz in die Kiste, und jede Flasche an ihren Platz. Drei Reihen zu vier.'); MA.set('packed'); MA.touch();
  await Ma.say('Zwölf Flaschen.'); await A.say('Ich habe keine dazuerfunden.'); await Ma.say('Und keine kaputtgemacht.'); await A.say('Das war schwieriger.');
  await A.wait(600); await Ma.say('Der Einsatz sitzt. Beim Anheben bleibt alles stehen.');
  var op = await A.choose(['„Bin ich jetzt Facharbeiter?“', '„Der Plan war eigentlich für Kinder.“']);
  if (op.id === 0){ await Ma.say('Für diese Kiste.'); await A.say('Kann ich das schriftlich bekommen?'); await Ma.say('Du kannst Geld bekommen.'); await A.say('Das genügt vorläufig.'); }
  else { await Ma.say('Die Flaschen stehen besser.'); await A.say('Sie widersprechen weniger.'); await Ma.say('Dann hattest du gute Mitarbeiter.'); }
  await De.say('Für ein bisschen Karton ist das ordentlich bezahlt.'); await Ma.say('Für zwölf heile Flaschen.'); await De.say('Das hätte ich auch gekonnt.'); await Ma.say('Die nächste Kiste gehört dir.'); await De.say('Ich muss meinen Stand bewachen.'); await Ma.say('Dann bewach ihn etwas leiser.');
  await Ma.say('Zähl nach.'); A.give('lohn'); A.give('klammern'); A.give('reste'); await A.say('Stimmt.'); await Ma.say('Dann sind wir uns einig.');
  await Ma.say('Die Reste und die vereinbarten Klammern kannst du behalten.'); await A.say('Auch die kleinen Stücke?'); await Ma.say('Gerade die. Große Stücke heben alle auf.');
  A.note('n_kiste', 'done'); A.save();
  await Ma.say('Und die Kiste muss noch zur Paradestraße, zu den Helfern hinter Jovans Sperre. Trägst du sie?'); await A.say('Für was?'); await Ma.say('Für mein Netz und meine Zugleine. Die brauche ich heute nicht mehr. Kiste und unterschriebener Schein zurück – dann gehören sie dir.');
  var op2 = await A.choose(['„Ich trage sie.“', '„Gleich. Ich muss vorher noch etwas erledigen.“']);
  if (op2.id === 0) await deliveryAccept(A); else await Ma.say('Die Flaschen warten. Die Helfer nicht ewig.'); }
async function deliveryAccept(A){ var Ma = A.npc('mara'); await Ma.say('Hier ist der Schein. Zwölf Flaschen, ein Schein, eine Unterschrift.'); A.give('lieferschein'); A.give('kiste'); A.set('delivery.job'); A.set('crate.carry'); A.note('n_lieferung'); MA.touch(); await A.say('Die Kiste ist schwerer, als sie aussieht. Die Flaschen auch.'); }
// S24: Sandale reißt beim ersten Transportversuch
MA.crateCheck = async function(A){ if (!A.has('kiste') || F('sandal') === 'fixed') return true; var Ma = A.npc('mara');
  if (F('sandal') !== 'broken'){ A.set('sandal', 'broken'); await A.say('Ich hebe die Kiste an und gehe los. Links macht es „klack“.'); await Ma.say('Stell die Kiste ab.'); await A.say('Ich habe sie gerade erst hochgehoben.'); await Ma.say('Und deine Sandale ist liegen geblieben.'); await A.say('Sie ist noch dran.'); await Ma.say('An dir oder an der Straße?');
    var op = await A.choose(['„Ich kann sie auch so tragen.“', '„Du hast Angst um die Flaschen.“']);
    if (op.id === 0){ await Ma.say('Das glaube ich. Bis zum ersten Stolpern.'); await A.say('Ich passe auf.'); await Ma.say('Dann fang bei deinem Fuß an.'); } else { await Ma.say('Auch.'); }
    A.take('kiste'); A.set('crate.carry', false); A.give('sandale'); A.note('n_sandale'); MA.touch(); await A.say('Ich stelle die Kiste zurück auf den Bock und ziehe die Sandale aus, bevor sie mich auszieht.'); return false; }
  await Ma.say('Mit der Sandale? Erst der Fuß, dann die Flaschen.'); return false; };
async function sandalOk(A){ var Ma = A.npc('mara'); await Ma.say('Zeig.'); await A.say('Sie sitzt fest.'); await Ma.say('Gut. Jetzt kannst du dich um den Weg kümmern.'); await A.say('Bekomme ich dafür noch mehr Lohn?'); await Ma.say('Dafür behältst du deinen Fuß.'); A.give('kiste'); A.set('crate.carry'); MA.touch(); }
// S27: Lieferung abschließen
async function s27(A){ var Ma = A.npc('mara');
  if (!A.has('kiste_leer') || !A.has('schein_ok')){ await Ma.say('Unsere Vereinbarung ist noch nicht vollständig.'); await A.say('Die Flaschen sind angekommen.');
    await Ma.say(!A.has('schein_ok') && !A.has('kiste_leer') ? 'Dann kann die Bestätigung mit zurückkommen. Und meine Kiste auch.' : (!A.has('schein_ok') ? 'Dann kann die Bestätigung mit zurückkommen.' : 'Und meine Kiste auch.')); return; }
  await Ma.say('Kiste?'); await A.say('Hier.'); await Ma.say('Schein?'); await A.say('Unterschrieben.'); await Ma.say('Alle zwölf?'); await A.say('Er hat nach jeder Reihe gezählt.'); await Ma.say('Dann warst du mit Fachpersonal unterwegs.');
  await A.wait(500); A.take('kiste_leer'); A.take('schein_ok'); A.set('crate.back'); A.set('delivery.done'); A.give('netz'); A.give('leine'); A.note('n_lieferung', 'done'); MA.touch();
  await Ma.say('Das Netz und die Zugleine gehören dir.');
  var op = await A.choose(['„Du musst nicht erst noch etwas kontrollieren?“', '„Ich habe die ganze Arbeit gemacht.“']);
  if (op.id === 0){ await Ma.say('Habe ich. Du bist wiedergekommen.'); }
  else { await Ma.say('Deshalb bekommst du den ganzen vereinbarten Lohn.'); await A.say('Dedo sagt, Kinder bekommen weniger.'); await Ma.say('Dann soll er Kinder einstellen. Bei mir zählt die Arbeit.'); }
  A.save(); }

// ---------------------------------------------------------------- Dedo
async function dedoTalk(A){ var De = A.npc('dedo');
  if (A.first('dedo.s08')){ await De.say('Suchst du etwas Bestimmtes?'); await A.say('Noch nicht.'); await De.say('Dann hast du bei mir die größte Auswahl.'); A.set('dedo.met'); }
  await A.menu(function(){ var hasAb = A.has('abrieb'), pl = F('plakette.read'); return [
    { t: 'Warum steht hier nur ein Schuh?', once: 'de.shoe', go: async function(){ await De.say('Weil ich den anderen nicht habe.'); await A.say('Wer kauft einen einzelnen Schuh?'); await De.say('Jemand mit einem anderen.'); await A.say('Und wenn es auch ein rechter ist?'); await De.say('Dann sucht er weiter. Ich kann nicht alle Geschäfte machen.'); } },
    { t: 'Was ist an dem Löffel so besonders?', if: !F('spoon.asked'), go: async function(){ await De.say('Persönlicher Frühstückslöffel des Schulgründers.'); await A.say('Hat er ihn unterschrieben?'); await De.say('Wer unterschreibt sein Besteck?'); await A.say('Wer es später teuer verkaufen will.'); await De.say('Er war Schulgründer. Kein Geschäftsmann.'); A.set('spoon.asked'); A.note('n_loeffel'); } },
    { t: 'Darf ich ihn umdrehen?', if: F('spoon.asked') && !F('spoon.turned'), go: s09turn },
    { t: 'Der Schulgründer starb 1898.', if: pl && !F('spoon.won') && F('spoon.asked'), go: s11 },
    { t: 'Der Löffel wurde 1954 hergestellt.', if: hasAb && !pl && !F('spoon.won'), go: async function(){ await De.say('Eine Jahreszahl allein widerlegt keine Geschichte.'); await A.say('Sie kann sie ziemlich kurz machen.'); await De.say('Dann fehlt dir noch der Rest.'); } },
    { t: 'Hast du schon einen anderen Löffel?', if: F('spoon.won'), once: 'de.spoon2', go: async function(){ await De.say('Ich verkaufe heute keine Geschichte mehr mit überprüfbaren Daten.'); } },
    { t: 'Ich nehme den rechten Schuh.', if: !F('shoe.bought'), go: s12 },
    { t: 'Mein Schuh bleibt unter deinem Tisch. Dafür bekomme ich den Stecken und die alte Befestigung.', if: A.has('schuh') && !F('table.fixed'), go: s13 },
    { t: 'Die Pfeife hätte ich gern.', if: !F('dedo.deal') && !F('ad.done'), go: async function(){ await De.say('Und womit mache ich dann Werbung?'); await A.say('Dein Stand steht mitten im Weg.'); await De.say('Das ist meine stille Werbung.'); A.set('pipe.asked'); } },
    { t: 'Ich kann dir bessere Werbung machen.', if: F('coat.known') && !F('dedo.deal'), go: s20 },
    { t: 'Was brauchst du noch für die Pfeife?', if: F('dedo.deal') && !F('ad.done'), go: async function(){ await De.say('Ein Schild, ein passender Knopf, ein zahlender Kunde.'); await A.say('Du kannst zählen.'); await De.say('Nur, wenn es sich lohnt.'); } },
    { t: 'Was kosten die Knöpfe?', if: F('coat.known') && !F('ad.done'), once: 'de.kn', go: async function(){ await De.say('Für dich? Nichts. Du hast keinen Mantel. Für einen Mann mit Mantel: einen anständigen Preis.'); } },
    { t: 'Ich muss weiter.', bye: true }
  ]; }); }
async function s09turn(A){ var De = A.npc('dedo'); await A.say('Darf ich ihn umdrehen?'); await De.say('Vorsichtig. Der hat Geschichte.'); await A.say('Vorne oder hinten?'); await De.say('Das solltest du selbst feststellen.');
  await A.anim('reachL'); A.set('spoon.turned'); MA.touch(); await A.say('Hier ist etwas eingeprägt.'); await De.say('Viele bedeutende Dinge tragen Spuren.'); await A.say('Die sind sehr klein.'); await De.say('Dann war der Hersteller bescheiden.');
  await A.say('Zu klein und zu flach zum Lesen. Wie auf einer abgegriffenen Münze.'); return 'bye'; }
async function rubbing(A, ctx){ var De = A.npc('dedo');
  if (F('spoon.won')){ await A.say('Der Löffel gehört mir. Den Abrieb brauche ich nicht mehr.'); return; }
  if (!F('spoon.turned')){ await A.say('Vorne ist nichts. Ich müsste ihn umdrehen – aber nicht, ohne zu fragen.'); return; }
  if (A.has('abrieb')){ await A.say('Den Abrieb habe ich schon.'); return; }
  await A.anim('reachL'); await A.say('Ich lege ein Blatt aus dem Heft über die Rückseite und reibe mit dem Bleistift darüber.'); A.give('abrieb');
  await A.doc({ title: 'Abrieb', paint: function(){ var b = new M.Buf(80, 36, M.P.s6); for (var y = 4; y < 32; y++) for (var x = 4; x < 76; x++) if (M.bayer(x, y) < 0.45) b.px(x, y, M.P.m3); M.text(b, '★ 1954', 20, 14, M.P.k1); return b; }, text: 'Ein kleiner Stern. Und ganz deutlich jetzt: 1954.', scale: 2 });
  await A.say('Jetzt kann ich die Schrift mitnehmen.'); await De.say('Die Schrift ja. Den Löffel nicht.'); await A.say('Das habe ich bemerkt.'); await De.say('Ich wollte nur sicher sein, dass wir beide dasselbe bemerkt haben.');
  if (!F('plakette.read')) await A.say('1954. Wann ist der Schulgründer gestorben? An seiner Büste steht es bestimmt.'); }
async function s11(A){ var De = A.npc('dedo');
  if (!A.has('abrieb')){ await De.say('Ein Verlust für die Schule.'); await A.say('Und dein Löffel …'); await De.say('… ist in bestem Zustand. Vermutungen sind keine Beweise.'); return; }
  await De.say('Ein Verlust für die Schule.'); await A.say('Der Löffel wurde 1954 hergestellt.'); await De.say('Dann hat er ihn nicht abgenutzt.'); await A.say('Er hat ihn gar nicht benutzt.'); await De.say('Daher der gute Zustand.');
  var op = await A.choose(['„Deine Herkunftsbeschreibung ist falsch.“', '„Vielleicht hat er aus dem Grab gefrühstückt.“']);
  if (op.id === 0){ await De.say('Sie ist großzügig formuliert.'); await A.say('Deine Garantie ist deutlicher formuliert.'); } else { await De.say('Dafür wäre der Löffel zu kurz.'); await A.say('Dann sind wir uns einig.'); }
  await De.say('Zeig mir den Abrieb noch einmal.'); await A.wait(700); A.take('abrieb'); A.give('loeffel'); A.set('spoon.won'); A.note('n_loeffel', 'done'); MA.touch();
  await De.say('Nimm. Den Samt behalte ich.'); await A.say('Und die Geschichte?'); await De.say('Die ist noch gut. Sie braucht nur einen anderen Gegenstand.'); await A.say('Einen älteren.'); await De.say('Du bist anstrengend.'); A.save(); }
async function s12(A){ var De = A.npc('dedo');
  if (!A.has('lohn')){ await De.say('Ich kann dir den Schuh zeigen. Bezahlen musst du ihn trotzdem.'); await A.say('Ich komme wieder.'); await De.say('Das hoffen alle Händler.'); return; }
  await A.say('Ich nehme den rechten Schuh.'); await De.say('Zum angegebenen Preis.'); await A.say('Für einen ganzen Schuh?'); await De.say('Siehst du eine fehlende Hälfte?');
  var op = await A.choose(['„Ich habe dafür gearbeitet.“', '„Kannst du etwas vom Preis abnehmen?“']);
  if (op.id === 0){ await De.say('Das höre ich gern.'); await A.say('Du musstest dafür nicht arbeiten.'); await De.say('Ich musste ihn finden.'); } else { await De.say('Den Preiszettel. Nach dem Kauf.'); await A.say('Du bist großzügig.'); await De.say('Erst nach dem Kauf.'); }
  A.take('lohn'); A.give('schuh'); A.set('shoe.bought'); MA.touch();
  await De.say('Gute Ware. Solider Absatz.'); await A.say('Genau darauf kommt es an.'); await De.say('Jetzt möchte ich wissen, was du vorhast.'); await A.say('Gleich.');
  if (A.first('!ix.shoe')){ var Ma = A.npc('mara'); await Ma.say('Du hast ihm wirklich den einzelnen Schuh verkauft?'); await De.say('Er wollte genau diesen.'); await Ma.say('Dann hat er etwas vor.'); await De.say('Das befürchte ich auch.'); } }
async function s13(A){ var De = A.npc('dedo'); if (F('table.fixed')){ await De.say('Der Tisch steht. Der Schuh arbeitet.'); return; }
  await A.say('Mein Schuh bleibt unter deinem Tisch. Dafür bekomme ich den Stecken und die alte Befestigung.'); await De.say('Du kaufst einen Schuh und ziehst ihn einem Tisch an?'); await A.say('Der hat das kürzere Bein.'); await De.say('Und der Senkel?'); await A.say('Den brauche ich selbst.'); await De.say('Ohne Senkel läuft er nicht.'); await A.say('Der Tisch soll stehen.'); await De.say('Gut. Aber du nimmst den Stecken erst, wenn meine Ware liegen bleibt.');
  await A.anim('pickup'); A.take('schuh'); A.give('senkel'); A.set('table.fixed'); MA.touch(); await A.say('Senkel raus, Schuh unter das kurze Bein, Absatz nach oben. Der Tisch steht – mit und ohne Stecken.'); }
async function takeStick(A){ var De = A.npc('dedo');
  if (F('stecken.taken')){ await A.say('Den Stecken habe ich schon.'); return; }
  if (!F('table.fixed')){ if (A.has('schuh')){ await De.say('Du wolltest einen Stecken. Jetzt bewegst du mein ganzes Geschäft.'); await A.say('Es ist noch alles da.'); await De.say('Halten möchte ich es trotzdem nicht den ganzen Nachmittag.'); } else await De.say('Stütze erst den Tisch. Ich stütze hier schon meinen Lebensunterhalt.'); return; }
  await A.anim('pickup'); A.give('stecken'); A.set('stecken.taken'); MA.touch(); await A.say('Jetzt steht er.'); await De.say('Ein rechter Schuh am linken Tischbein.'); await A.say('Stört dich das?'); await De.say('Nur wenn der Tisch reklamiert.');
  await A.say('Die Befestigung gehört auch mir.'); await De.say('Vereinbart ist vereinbart. Leider erinnerst du dich gut.');
  if (A.first('!ix.table')){ var Ma = A.npc('mara'); await Ma.say('Dein Tisch steht besser.'); await De.say('Gute Ware zahlt sich aus.'); await Ma.say('Das war gerade noch dein Schuh.'); await De.say('Jetzt arbeitet er hier.'); } }
async function s20(A){ var De = A.npc('dedo'); await A.say('Ich kann dir bessere Werbung machen.'); await De.say('Meine funktioniert. Du bist hier.');
  if (F('spoon.won')){ await A.say('Ich habe dir zuletzt einen Löffel abgenommen.'); await De.say('Dann machen wir zunächst andere Werbung.'); }
  await A.say('Eine Tafel für deine Mantelknöpfe. Mit einem wirklichen Käufer.'); await De.say('Die Tafel bleibt hier?'); await A.say('Ja.'); await De.say('Und der Käufer bezahlt?'); await A.say('Wenn der Knopf passt.'); await De.say('Dann bekommst du nach dem Verkauf die Pfeife. Gegen die Tafel.');
  var op = await A.choose(['„Du sollst hinterher nicht sagen, es war Zufall.“', '„Du wirst vor Kundschaft nicht mehr treten können.“']);
  if (op.id === 0){ await De.say('Ich kann einen Verkauf erkennen.'); await A.say('Bei dem Löffel warst du unsicher.'); await De.say('Wir sprechen jetzt über Knöpfe.'); }
  else { await De.say('Einer genügt fürs Erste.'); await A.say('Ich wollte klein anfangen.'); await De.say('Dann sind wir beide vorsichtig.'); }
  A.set('dedo.deal'); A.note('n_pfeife'); }

// ---------------------------------------------------------------- S21: Die Kinder werben, der Lehrer kauft
MA.adScene = async function(A){
  await A.fade(1, 320); await A.goto('markt', { fade: false, noEnter: true, x: 300, y: 126, f: 'L', noSave: true });
  var J = A.spawn({ id: 'jasna', ch: 'jasna', x: 330, y: 124, f: 'L', hgt: 42 }), N = A.spawn({ id: 'nedim', ch: 'nedim', x: 346, y: 128, f: 'L', hgt: 40 });
  A.spawn({ id: 'kidA', ch: 'kidA', x: 362, y: 124, f: 'L', hgt: 42 }); A.spawn({ id: 'kidB', ch: 'kidB', x: 376, y: 129, f: 'L', hgt: 42 });
  A.cam(200); await A.fade(0, 320); var De = A.npc('dedo');
  A.take('tafel'); A.set('tafel.placed'); MA.touch(); await A.say('Ich lehne die Tafel an Dedos Tisch. MANTELKNÖPFE, groß genug für jemanden, der einen braucht.');
  await J.say('Mantelknöpfe bei Dedo.'); await A.say('Auf mein Zeichen.'); await A.anim('wave');
  ['jasna', 'nedim', 'kidA', 'kidB'].forEach(function(k){ var a = MA.ACT[k]; if (a){ a.f = 'F'; a.idle = 'shout'; MA.setIdle(a); } });
  await A.kids('MANTELKNÖPFE BEI DEDO!'); await A.wait(400); ['jasna', 'nedim', 'kidA', 'kidB'].forEach(function(k){ var a = MA.ACT[k]; if (a){ a.f = 'L'; a.idle = null; MA.setIdle(a); } });
  var L = A.spawn({ id: 'lehrer', ch: 'lehrer', x: 196, y: 128, f: 'R', idle: 'coatHold', talk: 'coatTalk', hgt: 50 }); await L.walk(268, 124); await L.face('R');
  await L.say('Ein gewöhnlicher Mantelknopf?'); await De.say('Vier Löcher. Dunkel.'); await L.say('Kein Frühstücksknopf des Schulgründers.'); await De.say('Der hat beim Frühstück seinen Mantel ausgezogen.'); await L.say('Du weißt genau, was ich meine.'); await De.say('Dann halten wir uns an die vier Löcher.');
  await A.say('Ich suche ihn aus.'); await A.puzzle('knopf', {});
  await A.say('Der passt.'); await L.say('Tatsächlich.'); await De.say('Ihr Schüler kennt sich aus.'); await L.say('Er sieht genau hin.'); await De.say('Das ist mir bereits teuer zu stehen gekommen.');
  await A.wait(500); await L.say('Diesmal stimmt die Beschreibung.'); await De.say('Das erleichtert uns beiden den Nachmittag.');
  await A.say('Der Kunde hat bezahlt. Die Tafel bleibt. Jetzt die Pfeife.'); await De.say('Die Kinder bleiben nicht?'); await A.say('Nein.'); await De.say('Dann sind wir uns einig.');
  A.give('pfeife'); A.set('ad.done'); A.note('n_pfeife', 'done'); A.note('n_knopf', 'done'); MA.touch();
  await N.say('Haben wir jetzt für Dedo gearbeitet?'); await J.say('Wir haben geübt.'); await N.say('Für Dedo.'); await A.say('Und es hat funktioniert.');
  var Ma = A.npc('mara'); await Ma.say('Ein zahlender Kunde. Ganz ohne Pfeifen.'); await De.say('Ich erweitere meine Methoden.'); await Ma.say('Der Junge erweitert deine Methoden.'); await De.say('Ich lasse mich erweitern.');
  await A.fade(1, 320); ['jasna', 'nedim', 'kidA', 'kidB', 'lehrer'].forEach(function(k){ A.despawn(k); }); A.cam(null); MA.loadRoom('markt'); A.place(296, 126, 'L'); await A.fade(0, 320);
  await A.say('Die Klasse geht zurück zur Schule. Der Lehrer hält seinen Mantel nicht mehr zu.'); A.save(); };

// ---------------------------------------------------------------- Raum
function crateExit(to){ return { to: to, can: function(A){ return MA.crateCheck(A); } }; }
MA.defineRoom({ id: 'markt', name: 'Markt', width: K.W,
  paint: MA.ART.markt.paint, layers: MA.ART.markt.layers,
  walk: [[[4, 104], [178, 104], [182, 100], [206, 100], [210, 104], [416, 104], [416, 142], [4, 142]]],
  holes: [[36, 100, 60, 16], [88, 104, 34, 12], [222, 100, 90, 14]],
  start: [210, 124, 'F'], entries: { hof: [18, 124, 'R'], sperre: [194, 108, 'F'], most: [402, 124, 'L'], map: [210, 124, 'F'] },
  actors: function(S, G){ return [{ id: 'mara', ch: 'mara', x: 66, y: 101, f: 'F', hgt: 50 }, { id: 'dedo', ch: 'dedo', x: 266, y: 101, f: 'F', idle: G.flags['ad.done'] ? null : 'sell', hgt: 50 }]; },
  enter: async function(A, from){ if (A.first('markt.first')) await A.say('Der Markt. Heute riecht er nach Granatäpfeln, Kupfer und Ordnung.'); },
  hotspots: [
    { id: 'west', name: 'Zur Schule', r: [0, 56, 14, 88], st: [8, 124, 'L'], exit: crateExit('hof') },
    { id: 'gasse', name: 'Gasse zur Hauptstraße', r: K.alley, st: [194, 104, 'B'], exit: crateExit('sperre') },
    { id: 'ost', name: 'Hinunter zur Brücke', r: [406, 56, 14, 88], st: [412, 124, 'R'], exit: crateExit('most') },
    { id: 'mara', npc: 'mara', hgt: 50, talk: maraTalk, look: 'Mara. Kopftuch, kräftige Arme und ein Blick, der Flaschen zählt.',
      on: { einsatz: pack, auftrag: maraTalk, kiste_leer: s27, schein_ok: s27, sandale: async function(A){ await A.npc('mara').say('Ich verkaufe Getränke, keine Riemen. Binde sie fest.'); }, '*': async function(A){ await A.npc('mara').say('Das kaufe ich nicht, und das verkaufe ich nicht.'); } } },
    { id: 'kiste', name: 'Maras Kiste', r: function(S, G){ return [K.crate[0], K.crate[1]-6, K.crate[2], 18]; }, st: [104, 124, 'B'], tp: [104, 100],
      look: function(A){ return A.say(F('packed') ? (F('crate.back') ? 'Maras Kiste. Leer und zufrieden.' : 'Die gepackte Kiste. Zwölf Flaschen, jede an ihrem Platz.') : 'Eine Holzkiste. Zwölf Flaschen passen hinein, drei Reihen zu vier – wenn sie sich nicht drängeln. So schlagen sie gegeneinander.'); },
      take: async function(A){ if (F('delivery.job') && !A.has('kiste') && !F('delivered')){ if (F('sandal') === 'broken'){ await A.say('Mit der Sandale? Erst der Fuß, dann die Flaschen.'); return; } if (F('sandal') === 'fixed'){ await sandalOk(A); return; } A.give('kiste'); A.set('crate.carry'); MA.touch(); await A.say('Ich nehme die Kiste.'); return; }
        if (F('packed') && !F('delivery.job')){ await A.npc('mara').say('Erst sagst du, dass du sie trägst. Dann trägst du sie.'); return; } await A.say('Die Kiste gehört Mara. Und ohne Einsatz klappert sie.'); },
      on: { einsatz: pack, karton: 'Ein flacher Karton trennt nichts. Er bräuchte Löcher an den richtigen Stellen.', raster: 'Das Raster stimmt. Aber ohne die Löcher ist es noch kein Einsatz.', '*': 'Das gehört nicht in Maras Kiste.' } },
    { id: 'flaschen', name: 'Flaschen', r: K.bottles, look: 'Zwölf Flaschen für die Parade. Dunkelgrünes Glas, das gern klirrt.', take: async function(A){ await A.npc('mara').say('Die Flaschen bleiben, bis sie eine Verpackung haben.'); } },
    { id: 'karton', name: 'Packkarton', r: function(S, G){ return G.flags['karton.given'] ? [118, 102, 18, 14] : K.karton; }, look: 'Flacher Packkarton, an den Stand gelehnt.', take: async function(A){ if (!F('mara.job')){ await A.npc('mara').say('Der Karton gehört zur Arbeit. Erst die Arbeit.'); return; } await A.npc('mara').say('Du hast schon ein Stück. Mehr Karton macht keine bessere Kiste.'); } },
    { id: 'dedo', npc: 'dedo', hgt: 50, talk: dedoTalk, look: 'Dedo Muratović. Fes, Schnurrbart, und für jeden Gegenstand eine Geschichte.',
      on: { schuh: s13, abrieb: async function(A){ if (F('plakette.read')) return s11(A); await A.npc('dedo').say('Eine Jahreszahl allein widerlegt keine Geschichte.'); await A.say('Sie kann sie ziemlich kurz machen.'); await A.npc('dedo').say('Dann fehlt dir noch der Rest.'); },
        lohn: s12, tafel: async function(A){ if (!F('dedo.deal')) return s20(A); await A.npc('dedo').say('Ein Schild allein verkauft nichts. Bring Leute, die rufen, und einen, der kauft.'); },
        skizze: async function(A){ await A.npc('dedo').say('Dunkel, vier Löcher. Habe ich. Wer kauft ihn?'); }, '*': async function(A){ await A.npc('dedo').say('Das kaufe ich nicht. Ich verkaufe.'); } } },
    { id: 'tisch', name: 'Dedos Tisch', r: [222, 94, 90, 20], pri: 3, st: [236, 122, 'B'],
      look: function(A){ return A.say(F('table.fixed') ? 'Dedos Tisch steht jetzt auf einem rechten Schuh. Gerade wie nie.' : 'Dedos Tisch. Das linke Bein ist zu kurz; darunter klemmt ein Stecken, mit Draht und einem Nagel festgemacht. Hält. Gerade so.'); },
      on: { schuh: s13, '*': 'Der Tisch braucht das nicht. Er braucht etwas mit einem soliden Absatz.' } },
    { id: 'stecken', name: 'Stecken unter dem Tischbein', r: K.leg, st: [234, 122, 'B'], tp: [232, 110], vis: function(S, G){ return !G.flags['stecken.taken']; },
      look: function(A){ return A.say(F('table.fixed') ? 'Der Stecken steht jetzt nutzlos neben dem Schuh. Fast nutzlos.' : 'Ein gerader Stecken, mit Draht und Nagel am kurzen Tischbein festgemacht.'); }, take: takeStick, pull: takeStick,
      on: { schuh: s13, '*': takeStick } },
    { id: 'schuh', name: 'Rechter Schuh', r: K.shoe, st: [246, 122, 'B'], tp: [246, 92], vis: function(S, G){ return !G.flags['shoe.bought']; },
      look: 'Ein einzelner rechter Schuh. Solider Absatz. Daneben ein Zettel: „20 Dinar“.', take: s12, on: { lohn: s12 } },
    { id: 'loeffel', name: 'Löffel auf Samt', r: K.spoon, st: [264, 122, 'B'], tp: [264, 92], vis: function(S, G){ return !G.flags['spoon.won']; },
      look: function(A){ return A.say(F('spoon.turned') ? 'Der Löffel liegt umgedreht auf dem Samt. Auf der Rückseite: eine winzige Prägung, zu flach zum Lesen.' : 'Ein Löffel auf rotem Samt. Kärtchen: „Persönlicher Frühstückslöffel des Schulgründers“.'); },
      take: async function(A){ if (F('spoon.turned')) await A.npc('dedo').say('Die Schrift darfst du nehmen. Den Löffel nicht.'); else await A.npc('dedo').say('Anschauen kostet nichts. Mitnehmen schon.'); },
      on: { heft: rubbing, bleistift: rubbing, '*': async function(A){ await A.npc('dedo').say('Vorsichtig mit dem Schulgründer.'); } } },
    { id: 'pfeife', name: 'Pfeife', r: K.pipe, st: [280, 122, 'B'], tp: [280, 92], vis: function(S, G){ return !G.flags['ad.done']; }, look: 'Eine Trillerpfeife aus Blech. Damit holt Dedo die Leute an seinen Stand.',
      take: async function(A){ var De = A.npc('dedo'); if (F('dedo.deal')){ await De.say('Erst der Verkauf. Und selbst der ist nur die Hälfte – die Tafel sollte bei mir bleiben.'); return; } await De.say('Die ist nicht zu verkaufen. Sie verkauft für mich.'); } },
    { id: 'knoepfe', name: 'Knopfkiste', r: K.buttons, st: [294, 122, 'B'], tp: [297, 92], look: 'Dedos Knopfkiste. Hell, dunkel, zwei Löcher, vier Löcher – und ein Messingknopf mit Anker.',
      take: async function(A){ await A.npc('dedo').say('Knöpfe verkaufe ich an Leute mit Mantel.'); } },
    { id: 'schild', name: 'Garantie-Schild', r: K.sign, st: [300, 122, 'B'], read: async function(A){ await A.doc({ title: 'Schild an Dedos Stand', text: ['GARANTIJA – GARANTIE', 'Stimmt eine Beschreibung nicht, gehört die Ware dem, der es beweist.', '– D. Muratović'] }); }, look: async function(A){ return MA.ROOMS.markt.byId.schild.read(A); } },
    { id: 'kupfer', name: 'Kupferladen', r: K.copper, look: 'Ein Kupferschmied. Die Kessel glänzen, als hätten sie heute auch eine Parade.' },
    { id: 'minarett', name: 'Minarett', r: K.minaret, look: 'Ein Minarett über den Dächern. Von da oben sieht man bestimmt, wer wo steht.' },
    { id: 'girlanden', name: 'Wimpel', r: [0, 24, 420, 14], pri: 9, look: 'Wimpel in Blau, Weiß und Rot, quer über die Gasse. Für Tiko. Der Wind hält sich trotzdem nicht an die Reihenfolge.' }
  ]
});
// beim Tragen hält M. die Kiste sichtbar vor sich
MA.playerItem = function(){ return MA.has('kiste') ? 'crate' : (MA.has('kiste_leer') ? 'crateEmpty' : null); };
})(MA);
