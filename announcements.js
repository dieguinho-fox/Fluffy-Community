const SUPABASE_URL = "https://wnihobtfpmabgfwoddye.supabase.co";
const SUPABASE_KEY = "sb_publishable_Y-S1kbAXQE-Y4j-seMaHrQ_u_vUoTFF";

const supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

const announcementContainer = document.getElementById(
"announcementContainer"
);

const priorityInfo = {
low: {
color: "#22c55e",
icon: "🟢",
label: "Informação"
},


medium: {
    color: "#eab308",
    icon: "🟡",
    label: "Atenção"
},

high: {
    color: "#ef4444",
    icon: "🔴",
    label: "Importante"
}


};

async function loadAnnouncements() {
if (!announcementContainer) {
console.error(
"announcementContainer não foi encontrado no index.html."
);


    return;
}

announcementContainer.innerHTML =
    "<p>Carregando avisos...</p>";

try {
    const { data, error } = await supabaseClient
        .from("announcements")
        .select(
            "id, title, message, priority, created_at, expires_at"
        )
        .eq("active", true)
        .order("created_at", {
            ascending: false
        });

    if (error) {
        console.error(
            "Erro ao carregar avisos:",
            error
        );

        announcementContainer.innerHTML = `
            <div class="announcement-error">
                <strong>Não foi possível carregar os avisos.</strong>
                <p>${error.message}</p>
            </div>
        ;

        return;
    }

    console.log(
        "Avisos recebidos do Supabase:",
        data
    );

    const now = new Date();

    const activeAnnouncements = (data || []).filter(
        (announcement) => {
            if (!announcement.expires_at) {
                return true;
            }

            return (
                new Date(announcement.expires_at) > now
            );
        }
    );

    if (activeAnnouncements.length === 0) {
        announcementContainer.innerHTML =
            "<p>Nenhum aviso no momento.</p>";

        return;
    }

    announcementContainer.innerHTML = "";

    activeAnnouncements.forEach(
        (announcement) => {
            const priority =
                priorityInfo[
                    announcement.priority
                ] || priorityInfo.low;

            const article =
                document.createElement("article");

            article.className = "announcement";

            article.style.borderLeft =
                `5px solid ${priority.color}`;

            const header =
                document.createElement("div");

            header.className =
                "announcement-header";

            const title =
                document.createElement("h3");

            title.textContent =
                `${priority.icon} ${announcement.title}`;

            const label =
                document.createElement("span");

            label.className =
                "announcement-priority";

            label.textContent =
                priority.label;

            label.style.color =
                priority.color;

            const message =
                document.createElement("p");

            message.textContent =
                announcement.message;

            header.appendChild(title);
            header.appendChild(label);

            article.appendChild(header);
            article.appendChild(message);

            announcementContainer.appendChild(
                article
            );
        }
    );

} catch (error) {
    console.error(
        "Erro inesperado ao carregar avisos:",
        error
    );

    announcementContainer.innerHTML = `
        <div class="announcement-error">
            <strong>Erro ao carregar os avisos.</strong>
            <p>${error.message || error}</p>
        </div>
    `;
}

}

loadAnnouncements();
