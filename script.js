const today = new Date();
const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const todayStr = todayClean.toISOString().split('T')[0];

let installDateStr = localStorage.getItem('routine_install_date');
if (!installDateStr) {
    installDateStr = todayStr;
    localStorage.setItem('routine_install_date', installDateStr);
}

const installDate = new Date(installDateStr);
const container = document.getElementById('routine-container');

// Fonction principale pour mettre à jour l'affichage selon le jour sélectionné
function updateApp(selectedDate) {
    const d = selectedDate;
    const dOfWeek = d.getDay();
    const dOfMonth = d.getDate();
    const isActuallyToday = (d.getTime() === todayClean.getTime());
    
    // Calcul de l'écart pour les cycles et bases selon le jour sélectionné
    const diffDaysSelected = Math.round((d - installDate) / (1000 * 60 * 60 * 24));
    const cycleJ = ((diffDaysSelected % 3) + 1);
    const nextCycleJ = (((diffDaysSelected + 1) % 3) + 1);

    // Logique alternance hebdomadaire (Référence : Lundi 4 mai 2026 = Sarrasin)
    const refMonday = new Date(2026, 4, 4);
    const weekOffset = Math.floor(Math.floor((d - refMonday) / (24 * 60 * 60 * 1000)) / 7);
    const currentBase = (Math.abs(weekOffset) % 2 === 0) ? "Sarrasin" : "Son d'avoine";

    // Mise à jour du libellé de la date en haut
    document.getElementById('date-label').innerText = d.toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long'});

    const blocks = [
        { title: "Starter", 
          time: 0,
          text: "<b>Réveil :</b> Brossage de langue, rincer la brosse entre chaque passage\n" +
                (dOfWeek === 0 || dOfWeek === 6 
                    ? "<b>T-60min MINI :</b> Vitamine B, 1,5g Taurine, 5g Créatine\n" 
                    : "<b>T-30min :</b> 5g créatine + 1,5g + 2g TMG (+ vitamine B si pas possible en journée)\n") +
                "<b>T-20min :</b> Brossage de dents (BioMin F)\n" +
                "<b>T-20min :</b> Berbérine" 
        },
        { title: "Petit Dej", 
          time: 6, 
          text: "<b>T-15min :</b> 20g Whey, 10g Collagène, Canelle\n" + 
                "<b>T-14min :</b> Psyllium\n" + 
                "<b>Final :</b> Noix.<br><b>Jó étvágyat !</b><br><br>" +
                "<b>T+1min :</b> Rinçage de dents à l'eau claire"
        },
        { title: "Exercices Matin", 
          time: 7, 
          items: (dOfWeek === 0 || dOfWeek === 6) 
            ? ["Jambes sur le dos", "Activité week-end"] 
            : ["Jambes sur le dos", "SM System"],
          text: (dOfWeek === 0 || dOfWeek === 6) ?
                "<i style='font-size: 0.9em; color: #94a3b8;'>• 40min marche zone 2\n• Panenka Marie\n• SM System 'full'\n• Bird Dog\n• Spine twist\n• 30-60sec Dead hang\n• 5min 90/90</i>" : ""
        },
        { title: "Étirements Matin", time: 9, items: ["Bras tendus/Paumes ouvertes", "Etirements Cou/Panenka", "Encadrement porte", "Grip bureau 3x10sec", "Ronds de la tête"] },
        { title: "Déjeuner", time: 11, 
          text: (dOfWeek === 0 || dOfWeek === 6)
            ? "Berbérine (T-15min), Vitamine D + Omega 3"
            : "11h : vitamine B + Mg avec un grand verre d'eau<br><br>Berbérine (T-15min), Vitamine D + Omega 3" },
        { title: "Étirements Après-midi", time: 15, items: ["Bras tendus/Paumes ouvertes", "Etirements Cou/Panenka", "Encadrement porte", "Grip bureau 3x10sec", "Ronds de la tête"] },
        { title: "Sport Soir", time: 17, items: ["15min 90/90 Reset discal", "15min SM System + Bird Dog", "20min Force", "Ischios à l'élastique (plier genou, extension maximum)", "Spine twist", "Brique sous les omoplates", "Dead Hang (30-60sec)"] },
        { title: "Détails Force (Info)", time: 17, text: `1. <b>Gobelet Squat :</b> 3x12.\n2. <b>Fentes :</b> 3x20.\n3. <b>Rowing :</b> 3x12/bras.\n4. <b>Pont Fessier :</b> 2x15.\n5. <b>Planche :</b> 3 x 10s. actives.\n6. <b>Swan dive</b>` },
        { title: "Dîner",
          time: 19,
          text: (dOfWeek === 5 || dOfWeek === 6)
                ? "<b>Fromage :</b> T-30min berbérine, T-20min 10g de Psyllium avec beaucoup d'eau\n" +
                  "<b>T+2/3h :</b> 2x Magnesium + 1,5g TMG + 1,5g Taurine + 10g collagène\n\n" +
                  "<b>T+45 :</b> " + (cycleJ === 3 ? "3cac bombées de graines de courges moulues" : "20g de germes de blé moulues") + " + 100g yaourt + 50g kéfir"
                : (dOfWeek === 0
                    ? (dOfMonth <= 7 ? "Foie de morue" : "Sardines") + "\n\n<b>T+45 :</b> " + (cycleJ === 3 ? "3cac bombées de graines de courges moulues" : "20g de germes de blé moulues") + " + 100g yaourt + 50g kéfir"
                    : "<b>T-15min :</b> berbérine\n" +
                      "<b>T-10min (pâtes dans l'eau) :</b> 2 c.a.c. de lin + yaourt\n" +
                      "<b>T-5/T-2min :</b> vinaigre (2c.a.c. + 200ml à la paille)\n" +
                      "<b>T-0min :</b> pâtes + 1,5 c.a.s. levure + omega 3\n" +
                      "<b>T+2 :</b> rinçage alcalin (bicarbonate)\n\n" +
                      "<b>T+45 :</b> " + (cycleJ === 3 ? "3cac bombées de graines de courges moulues" : "20g de germes de blé moulues") + " + 100g yaourt + 50g kéfir")
        },
        { title: "Préparation Petit Dej", 
          time: 20, 
          items: ["Préparation terminée"], 
          text: "• <b>Base :</b> " + currentBase + 
                "\n• <b>Graines :</b> Graines de chia et lin" + (nextCycleJ === 3 ? " + 2 c.a.c de courge" : "") + 
                "\n• <b>Fruit :</b> Myrtilles" + 
                "\n• <b>Liquide :</b> Kéfir + Podmasli" +
                (dOfWeek >= 0 && dOfWeek <= 4 
                  ? "<br><br>• <b>Prépa D+1 :</b> Vit B + Mg + Vit D + Omega 3" 
                  : "")
        },
        { title: "Soir", time: 21, text: "Magnesium\nHerbadent, fil dentaire et brosse interdentaire\nBain de bouche 1j/2\nExercice jambes sur le dos\nDormir avec la couette entre les genoux" }
    ];

    container.innerHTML = ''; // On vide pour reconstruire
    blocks.forEach((b) => {
        const div = document.createElement('div');
        // On active visuellement le bloc uniquement si on est sur AUJOURD'HUI
        div.className = 'block' + (isActuallyToday && today.getHours() >= b.time ? ' active' : '');
        let html = `<h2>${b.title}</h2>`;
        if (b.items) b.items.forEach(it => { 
            // Checkbox désactivée si on n'est pas sur le jour réel
            const disabledAttr = isActuallyToday ? '' : 'disabled';
            html += `<label class="item"><input type="checkbox" ${disabledAttr} onchange="logActivity('${b.title}')"><span>${it}</span></label>`; 
        });
        if (b.text) html += `<div class="fixed-text" style="margin-top: 10px;">${b.text}</div>`;
        div.innerHTML = html;
        container.appendChild(div);
    });
    
    renderStats();
    if(isActuallyToday) scrollToCurrentTask();
}

// Barre de navigation fixe en bas
function renderNav() {
    let nav = document.getElementById('day-nav');
    if (!nav) {
        nav = document.createElement('div');
        nav.id = 'day-nav';
        nav.style = "position:fixed; bottom:0; left:0; right:0; background:#0f172a; display:flex; justify-content:space-around; padding:10px; border-top:1px solid #334155; z-index:1000;";
        document.body.appendChild(nav);
    }
    
    const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    nav.innerHTML = '';
    
    jours.forEach((nom, index) => {
        const btn = document.createElement('button');
        btn.innerText = nom;
        const isCurrentDay = index === today.getDay();
        btn.style = `background: ${isCurrentDay ? '#3b82f6' : '#1e293b'}; color: white; border: none; padding: 10px 5px; border-radius: 6px; flex: 1; margin: 0 3px; font-size: 0.8em; font-weight: bold;`;
        
        btn.onclick = () => {
            const cible = new Date(todayClean);
            const diff = index - today.getDay();
            cible.setDate(todayClean.getDate() + diff);
            updateApp(cible);
            window.scrollTo(0, 0);
        };
        nav.appendChild(btn);
    });
}

const trackedBlocks = ["Exercices Matin", "Étirements Matin", "Étirements Après-midi", "Sport Soir", "Préparation Petit Dej"];

function logActivity(title) {
    if (!trackedBlocks.includes(title)) return;
    let history = JSON.parse(localStorage.getItem('routine_stats') || "{}");
    if (!history[title]) history[title] = [];
    if (!history[title].includes(todayStr)) {
        history[title].push(todayStr);
        localStorage.setItem('routine_stats', JSON.stringify(history));
        renderStats();
    }
}

function getStats(title) {
    const history = JSON.parse(localStorage.getItem('routine_stats') || "{}");
    const dates = history[title] || [];
    const diffDaysActual = Math.round((todayClean - installDate) / (1000 * 60 * 60 * 24));
    const totalPossibleDays = diffDaysActual + 1;
    const rate = Math.round((dates.length / totalPossibleDays) * 100);
    let streak = 0;
    let checkDate = new Date(todayClean);
    let checkStr = checkDate.toISOString().split('T')[0];

    if (!dates.includes(checkStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
        checkStr = checkDate.toISOString().split('T')[0];
    }
    while (dates.includes(checkStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        checkStr = checkDate.toISOString().split('T')[0];
    }
    return { streak, rate: Math.min(rate, 100) };
}

function renderStats() {
    let statsDiv = document.getElementById('stats-recap');
    if (!statsDiv) {
        statsDiv = document.createElement('div');
        statsDiv.id = 'stats-recap';
        statsDiv.style = "margin: 20px 10px 80px 10px; padding: 15px; background: #1e293b; border-radius: 12px; color: white; font-size: 0.85em;";
        container.after(statsDiv);
    }
    let html = "<h3 style='margin-top:0; border-bottom: 1px solid #334155; padding-bottom: 8px;'>Tableau de Bord</h3>";
    trackedBlocks.forEach(title => {
        const s = getStats(title);
        html += `<div style="display:flex; justify-content: space-between; margin: 8px 0; border-bottom: 1px solid #2d3748; padding-bottom: 4px;">
            <span>${title}</span>
            <span>🔥 <b>${s.streak}</b></span>
            <span style="width: 55px; text-align: right;"><b>${s.rate}%</b></span>
        </div>`;
    });
    statsDiv.innerHTML = html;
}

function scrollToCurrentTask() {
    const activeBlocks = document.querySelectorAll('.block.active');
    if (activeBlocks.length > 0) {
        const currentBlock = activeBlocks[activeBlocks.length - 1];
        setTimeout(() => {
            currentBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }
}

// Initialisation
updateApp(todayClean);
renderNav();
