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

function updateApp(selectedDate) {
    const d = selectedDate;
    const dOfWeek = d.getDay();
    const dOfMonth = d.getDate();
    const isActuallyToday = (d.getTime() === todayClean.getTime());
    
    const diffDaysSelected = Math.round((d - installDate) / (1000 * 60 * 60 * 24));
    const cycleJ = ((diffDaysSelected % 3) + 1);
    const nextCycleJ = (((diffDaysSelected + 1) % 3) + 1);

    const refMonday = new Date(2026, 4, 4);
    const weekOffset = Math.floor(Math.floor((d - refMonday) / (24 * 60 * 60 * 1000)) / 7);
    const currentBase = (Math.abs(weekOffset) % 2 === 0) ? "Sarrasin" : "Son d'avoine";

    document.getElementById('date-label').innerText = d.toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long'});

    const blocks = [
        { title: "Starter", time: 0, text: "<b>Réveil :</b> Brossage de langue\n" + (dOfWeek === 0 || dOfWeek === 6 ? "<b>T-60min :</b> Vitamine B, 1,5g Taurine, 5g Créatine, 2g TMG\n" : "<b>T-30min :</b> 5g créatine + 1,5g + 2g TMG (+ vitamine B si pas possible en journée)\n") + "<b>T-20min :</b> Brossage de dents, Berbérine" },
        { title: "Petit Dej", time: 6, text: "<b>T-15min :</b> 20g Whey, 10g Collagène, Canelle\n<b>T-14min :</b> 10g Psyllium (2.5 cac)\n<b>Final :</b> Noix.<br><b>Jó étvágyat !</b>" },
        { title: "Exercices Matin", time: 7, items: (dOfWeek === 0 || dOfWeek === 6) ? ["Jambes sur le dos", "Activité week-end"] : ["Jambes sur le dos", "SM System"], text: (dOfWeek === 0 || dOfWeek === 6) ? "<i style='font-size: 0.9em; color: #94a3b8;'>• 40min marche Z2 • Panenka • SM System full • Bird Dog • Spine twist • Dead hang • 90/90</i>" : "" },
        { title: "Étirements Matin", time: 9, items: ["Bras tendus", "Cou/Panenka", "Encadrement porte", "Grip 3x10s", "Ronds tête"] },
        { title: "Déjeuner", time: 11, text: (dOfWeek === 0 || dOfWeek === 6) ? "Berbérine, Vitamine D + Omega 3" : "11h : vitamine B + Mg avec un grand verre d'eau<br><br>Berbérine, Vitamine D + Omega 3" },
        { title: "Étirements Après-midi", time: 15, items: ["Bras tendus", "Cou/Panenka", "Encadrement porte", "Grip 3x10s", "Ronds tête"] },
        { title: "Sport Soir", time: 17, items: ["15min 90/90", "15min SM System", "20min Force", "Ischios élastique", "Spine twist", "Brique omoplates", "Dead Hang"] },
        { title: "Détails Force (Info)", time: 17, text: `1. Squat 3x12 | 2. Fentes 3x20 | 3. Rowing 3x12 | 4. Pont Fessier 2x15 | 5. Planche 3x10s | 6. Swan dive` },
        { title: "Dîner", time: 19, text: (dOfWeek === 5 || dOfWeek === 6) ? "<b>Fromage :</b> T-30min berbérine, T-20min 10g de Psyllium avec beaucoup d'eau\n<b>T+2/3h :</b> 2x Magnesium + 1,5g TMG + 1,5g Taurine + 10g collagène\n\n<b>T+45 :</b> " + (cycleJ === 3 ? "3cac bombées de graines de courges" : "20g de germes de blé") + " + 100g yaourt + 50g kéfir" : (dOfWeek === 0 ? (dOfMonth <= 7 ? "Foie de morue" : "Sardines") + "\n\n<b>T+45 :</b> " + (cycleJ === 3 ? "3cac bombées de graines de courges" : "20g de germes de blé") + " + 100g yaourt + 50g kéfir" : "<b>T-15min :</b> berbérine\n<b>T-10min :</b> Lin + yaourt\n<b>T-5min :</b> Vinaigre\n<b>T-0min :</b> Pâtes + Levure + Omega 3\n<b>T+2 :</b> Rinçage alcalin\n\n<b>T+45 :</b> " + (cycleJ === 3 ? "3cac bombées de graines de courges" : "20g de germes de blé") + " + 100g yaourt + 50g kéfir") },
        { title: "Préparation Petit Dej", time: 20, items: ["Prêt"], text: "• <b>Base :</b> " + currentBase + "\n• <b>Graines :</b> Chia, Lin" + (nextCycleJ === 3 ? " + Courge" : "") + "\n• <b>Fruit :</b> Myrtilles\n• <b>Liquide :</b> Kéfir + Podmasli" + (dOfWeek >= 1 && dOfWeek <= 5 ? "<br><br>• <b>Prépa D+1 :</b> Vit B, Mg, Vit D, Omega 3" : "") },
        { title: "Soir", time: 21, text: "Magnesium\n Brosse à dents interdentaire\n Exercice jambes sur le dos\n Couette entre les genoux" }
    ];

    container.innerHTML = '';
    blocks.forEach((b) => {
        const div = document.createElement('div');
        div.className = 'block' + (isActuallyToday && today.getHours() >= b.time ? ' active' : '');
        let html = `<h2>${b.title}</h2>`;
        if (b.items) b.items.forEach(it => { 
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

function renderNav() {
    let nav = document.getElementById('day-nav');
    if (!nav) {
        nav = document.createElement('div');
        nav.id = 'day-nav';
        nav.style = "position:fixed; bottom:0; left:0; right:0; background:#0f172a; display:flex; justify-content:space-around; padding:12px 5px; border-top:2px solid #3b82f6; z-index:9999; box-shadow: 0 -5px 15px rgba(0,0,0,0.5);";
        document.body.appendChild(nav);
    }
    
    // Ordre Lundi -> Dimanche
    const joursSemaine = [
        { nom: 'Lun', index: 1 },
        { nom: 'Mar', index: 2 },
        { nom: 'Mer', index: 3 },
        { nom: 'Jeu', index: 4 },
        { nom: 'Ven', index: 5 },
        { nom: 'Sam', index: 6 },
        { nom: 'Dim', index: 0 }
    ];

    nav.innerHTML = '';
    joursSemaine.forEach((j) => {
        const btn = document.createElement('button');
        btn.innerText = j.nom;
        const isCurrentDay = j.index === today.getDay();
        btn.style = `background: ${isCurrentDay ? '#3b82f6' : '#1e293b'}; color: white; border: 1px solid #334155; padding: 12px 0; border-radius: 8px; flex: 1; margin: 0 4px; font-size: 0.85em; font-weight: bold; cursor: pointer; -webkit-appearance: none;`;
        
        btn.onclick = () => {
            const cible = new Date(todayClean);
            // Calcul du décalage par rapport au jour actuel
            let diff = j.index - today.getDay();
            // Ajustement spécifique pour que le Dimanche (0) soit vu après le Samedi (6)
            if (j.index === 0 && today.getDay() !== 0) diff = 7 - today.getDay();
            if (j.index !== 0 && today.getDay() === 0) diff = j.index - 7;

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
        statsDiv.style = "margin: 20px 10px 100px 10px; padding: 15px; background: #1e293b; border-radius: 12px; color: white; font-size: 0.85em;";
        container.after(statsDiv);
    }
    let html = "<h3 style='margin-top:0; border-bottom: 1px solid #334155; padding-bottom: 8px;'>Tableau de Bord</h3>";
    trackedBlocks.forEach(title => {
        const s = getStats(title);
        html += `<div style="display:flex; justify-content: space-between; margin: 8px 0; border-bottom: 1px solid #2d3748; padding-bottom: 4px;"><span>${title}</span><span>🔥 <b>${s.streak}</b></span><span style="width: 55px; text-align: right;"><b>${s.rate}%</b></span></div>`;
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

updateApp(todayClean);
renderNav();
