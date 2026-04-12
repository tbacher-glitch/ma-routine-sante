const today = new Date();
const dayOfWeek = today.getDay();
const dayOfMonth = today.getDate();
const startDate = new Date('2026-04-11');
const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
const cycleJ = ((diffDays % 3) + 1);
const nextCycleJ = (((diffDays + 1) % 3) + 1);

document.getElementById('date-label').innerText = today.toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long'});

// --- CONFIGURATION DES BLOCS ---
const blocks = [
    { title: "Starter", time: 0, text: "<b>T-" + (dayOfWeek === 0 || dayOfWeek === 6 ? "60" : "30") + "min :</b> Vitamine B, 1g Taurine, 5g Créatine\n" + "<b>T-15min :</b> Berbérine" },
    { title: `Petit Dej (Option ${cycleJ === 3 ? 'J3' : 'J1/J2'})`, time: 6, text: "<b>T-15min :</b> 20g Whey, 10g Collagène, Canelle\n" + "<b>T-14min :</b> Psyllum\n" + "<b>T-2min :</b> Cacao " + (cycleJ === 3 ? "" : "+ Germes de blé (1 c.a.s. bombée)") + "\n" + "<b>Final :</b> Noix.<br><b>Jó étvágyat !</b>" },
    { title: "Exercices Matin", time: 7, items: ["Jambes sur le dos", "SM System"] },
    { title: "Étirements Matin", time: 9, items: ["Bras tendus/Paumes ouvertes", "Etirements Cou/Panenka", "Encadrement porte"] },
    { title: "Déjeuner", time: 11, text: "Berbérine (T-15min), Vitamine D + Omega 3" },
    { title: "Étirements Après-midi", time: 15, items: ["Bras tendus/Paumes ouvertes", "Etirements Cou/Panenka", "Encadrement porte"] },
    { title: "Sport Soir", time: 17, items: ["15min 90/90 Reset discal", "15min SM System", "20min Force", "Ischios à l'élastique", "Brique sous les omoplates"] },
    { title: "Détails Muscu (Info)", time: 17, text: `1. <b>Gobelet Squat :</b> 3x12.\n2. <b>Fentes :</b> 3x20.\n3. <b>Rowing :</b> 3x12/bras.\n4. <b>Pont Fessier :</b> 2x15.\n5. <b>Planche :</b> 5-6 x 10s.` },
    { title: "Dîner", 
  time: 19, 
  display: (dayOfWeek >= 1 && dayOfWeek <= 4) || dayOfWeek === 0, 
  text: dayOfWeek === 0 ? (dayOfMonth <= 7 ? "Foie de morue" : "Sardines") : 
    "<b>T-20min :</b> Berbérine (avec un fond d'eau)\n" +
    "<b>T-15min :</b> Mixer Brocoli avec un fond d'eau\n" +
    "<b>T-5min :</b> Shot de Brocoli et vinaigre avec 250ml d'eau (bouclier)\n" +
    "<b>T-0 :</b> Assiette de pâtes (1 c.a.s levure + 2 c.a.c lin)\n" +
    "<b>Pendant :</b> Omega 3" },
    { title: "Préparation Petit Dej", time: 20, items: ["Préparation terminée"], text: "• <b>Base :</b> " + (Math.floor(diffDays / 7) % 4 === 3 ? "Orge/Sarrasin" : "Son d'avoine") + "\n• <b>Graines :</b> Graines de chia et lin" + (nextCycleJ === 3 ? " + 2 c.a.c de courge" : "") + "\n• <b>Fruit :</b> " + (dayOfWeek === 0 ? "Pomme" : "Myrtilles") + "\n• <b>Liquide :</b> Kéfir + Podmasli" },
    { title: "Soir", time: 21, text: "Magnesium\nFil dentaire et brosse interdentaire\nExercice jambes sur le dos\nDormir avec la couette entre les genoux" }
];

// --- MOTEUR DE STATISTIQUES ---
const trackedBlocks = ["Exercices Matin", "Étirements Matin", "Étirements Après-midi", "Sport Soir", "Préparation Petit Dej"];

function logActivity(title) {
    if (!trackedBlocks.includes(title)) return;
    let history = JSON.parse(localStorage.getItem('routine_stats') || "{}");
    const todayStr = new Date().toISOString().split('T')[0];
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
    if (dates.length === 0) return { streak: 0, rate: 0 };

    // Streak
    let streak = 0;
    let curr = new Date();
    while (dates.includes(curr.toISOString().split('T')[0])) {
        streak++;
        curr.setDate(curr.getDate() - 1);
    }

    // Rate (sur les 100 derniers jours de l'historique global)
    const last100 = dates.slice(-100);
    const rate = Math.round((last100.length / (diffDays + 1)) * 100);
    return { streak, rate: Math.min(rate, 100) };
}

function renderStats() {
    let statsDiv = document.getElementById('stats-recap');
    if (!statsDiv) {
        statsDiv = document.createElement('div');
        statsDiv.id = 'stats-recap';
        statsDiv.style = "margin: 20px 10px; padding: 15px; background: #1e293b; border-radius: 12px; color: white; font-size: 0.85em;";
        container.after(statsDiv);
    }
    
    let html = "<h3 style='margin-top:0; border-bottom: 1px solid #334155; padding-bottom: 8px;'>Tableau de Bord</h3>";
    trackedBlocks.forEach(title => {
        const s = getStats(title);
        html += `<div style="display:flex; justify-content: space-between; margin: 8px 0; border-bottom: 1px solid #2d3748; padding-bottom: 4px;">
            <span style="width: 140px;">${title}</span>
            <span>🔥 <b>${s.streak}</b></span>
            <span style="width: 60px; text-align: right;">💪 <b>${s.rate}%</b></span>
        </div>`;
    });
    statsDiv.innerHTML = html;
}

// --- AFFICHAGE ---
const container = document.getElementById('routine-container');
blocks.forEach((b) => {
    if (b.display === false) return;
    const div = document.createElement('div');
    div.className = 'block' + (today.getHours() >= b.time ? ' active' : '');
    let html = `<h2>${b.title}</h2>`;
    if (b.text) html += `<div class="fixed-text">${b.text}</div>`;
    if (b.items) b.items.forEach(it => { 
        html += `<label class="item"><input type="checkbox" onchange="logActivity('${b.title}')"><span>${it}</span></label>`; 
    });
    div.innerHTML = html;
    container.appendChild(div);
});

renderStats();
function scrollToCurrentTask() {
    const activeBlocks = document.querySelectorAll('.block.active');
    if (activeBlocks.length > 0) {
        const currentBlock = activeBlocks[activeBlocks.length - 1];
        setTimeout(() => {
            currentBlock.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 500);
    }
}

scrollToCurrentTask();