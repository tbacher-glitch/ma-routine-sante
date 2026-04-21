const today = new Date();
const dayOfWeek = today.getDay();
const dayOfMonth = today.getDate();

// Création d'une date "propre" (sans heure) pour aujourd'hui
const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const todayStr = todayClean.toISOString().split('T')[0];

let installDateStr = localStorage.getItem('routine_install_date');
if (!installDateStr) {
    installDateStr = todayStr;
    localStorage.setItem('routine_install_date', installDateStr);
}

// Calcul du nombre de jours réels écoulés
const installDate = new Date(installDateStr);
const diffDays = Math.round((todayClean - installDate) / (1000 * 60 * 60 * 24));
// --------------------------------------------------

const cycleJ = ((diffDays % 3) + 1);
const nextCycleJ = (((diffDays + 1) % 3) + 1);

document.getElementById('date-label').innerText = today.toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long'});

// --- CONFIGURATION DES BLOCS ---
const blocks = [
    { title: "Starter", 
      time: 0, 
      text: "<b>Au réveil :</b> Brossage de langue, rincer la brosse entre chaque passage\n" +
            "<b>T-" + (dayOfWeek === 0 || dayOfWeek === 6 ? "60" : "30") + "min :</b> Vitamine B, 1g Taurine, 5g Créatine\n" +
            "<b>T-20min :</b> Brossage de dents (BioMin F)\n" + 
            "<b>T-15min :</b> Berbérine" 
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
      // La ligne 1 reste fixe, la ligne 2 change selon le week-end
      items: (dayOfWeek === 0 || dayOfWeek === 6) 
        ? ["Jambes sur le dos", "Activité week-end"] 
        : ["Jambes sur le dos", "SM System"],
      // On affiche le détail textuel uniquement le week-end
      text: (dayOfWeek === 0 || dayOfWeek === 6) ? 
        "<i style='font-size: 0.9em; color: #94a3b8;'>• 40min marche zone 2\n• Panenka Marie\n• SM System 'full'\n• Bird Dog\n• Spine twist\n• 30-60sec Dead hang\n• 5min 90/90</i>" : ""
    },
    { title: "Étirements Matin", time: 9, items: ["Bras tendus/Paumes ouvertes", "Etirements Cou/Panenka", "Encadrement porte", "Grip bureau 3x10sec", "Ronds de la tête"] },
    { title: "Déjeuner", time: 11, text: "Berbérine (T-15min), Vitamine D + Omega 3" },
    { title: "Étirements Après-midi", time: 15, items: ["Bras tendus/Paumes ouvertes", "Etirements Cou/Panenka", "Encadrement porte", "Grip bureau 3x10sec", "Ronds de la tête"] },
    { title: "Sport Soir", time: 17, items: ["15min 90/90 Reset discal", "15min SM System + Bird Dog", "20min Force", "Ischios à l'élastique (plier genou, extension maximum)", "Spine twist", "Brique sous les omoplates", "Dead Hang (30-60sec)"] },
    { title: "Détails Muscu (Info)", time: 17, text: `1. <b>Gobelet Squat :</b> 3x12.\n2. <b>Fentes :</b> 3x20.\n3. <b>Rowing :</b> 3x12/bras.\n4. <b>Pont Fessier :</b> 2x15.\n5. <b>Planche :</b> 3 x 10s. actives.\n6. <b>Swan dive</b>` },
    { title: "Dîner", 
  time: 19, 
  display: (dayOfWeek >= 1 && dayOfWeek <= 4) || dayOfWeek === 0, 
  text: dayOfWeek === 0 ? (dayOfMonth <= 7 ? "Foie de morue" : "Sardines") : 
    "<b>T-15min :</b> berbérine\n" +
        "<b>T-10min (pâtes dans l'eau) :</b> vinaigre (2c.a.c. + 200ml à la paille) + 2 c.a.c. de lin + yaourt\n" +
        "<b>T-0min :</b> pâtes + 1,5 c.a.s. levure + omega 3\n\n" +
       "<i style='font-size: 0.9em; color: #94a3b8;'>Vinaigre (enzymatique), Lin (mécanique), Levure (métabolique)</i><br><br>" +
        "<b>T+2 :</b> rinçage alcalin (100ml d'eau tiède + 1/2 cac de bicarbonate de soude), ne pas rincer<br><br>" +
        "<b>T+45 :</b> " + (cycleJ === 3 ? "3cac bombées de graines de courges moulues" : "20g de germes de blé moulues") + " + 100g yaourt + 50g kéfir" 
    },
    { title: "Préparation Petit Dej", time: 20, items: ["Préparation terminée"], text: "• <b>Base :</b> " + (Math.floor(diffDays / 7) % 4 === 3 ? "Orge/Sarrasin" : "Son d'avoine") + "\n• <b>Graines :</b> Graines de chia et lin" + (nextCycleJ === 3 ? " + 2 c.a.c de courge" : "") + "\n• <b>Fruit :</b> " + (dayOfWeek === 6 ? "Pomme" : "Myrtilles") + "\n• <b>Liquide :</b> Kéfir + Podmasli" },
    { title: "Soir", time: 21, text: "Magnesium\nHerbadent, fil dentaire et brosse interdentaire\nBain de bouche 1j/2\nExercice jambes sur le dos\nDormir avec la couette entre les genoux" }
];

// --- MOTEUR DE STATISTIQUES ---
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
    
    // On calcule le nombre de jours total (minimum 1)
    const totalPossibleDays = diffDays + 1;
    
    // Le taux est : (nombre de jours cochés / nombre de jours depuis install)
    const rate = Math.round((dates.length / totalPossibleDays) * 100);

    let streak = 0;
    let checkDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let checkStr = checkDate.toISOString().split('T')[0];

    // Si pas coché aujourd'hui, on vérifie si la série était maintenue jusqu'à hier
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
    if (b.items) b.items.forEach(it => { 
        html += `<label class="item"><input type="checkbox" onchange="logActivity('${b.title}')"><span>${it}</span></label>`; 
    });
    if (b.text) html += `<div class="fixed-text" style="margin-top: 10px;">${b.text}</div>`;
    div.innerHTML = html;
    container.appendChild(div);
});

document.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });

renderStats();

function scrollToCurrentTask() {
    const activeBlocks = document.querySelectorAll('.block.active');
    if (activeBlocks.length > 0) {
        const currentBlock = activeBlocks[activeBlocks.length - 1];
        setTimeout(() => {
            currentBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
    }
}
scrollToCurrentTask();
document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
