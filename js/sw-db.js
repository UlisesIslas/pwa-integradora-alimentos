const db = new PouchDB("recolecciones");
const serverApi = 'https://recoleccion-api-production.up.railway.app/api/recoleccion_alimentos/store';

function saveRecolection(recolection) {
    recolection._id = new Date().toISOString();
    return db.put(recolection).then(() => {
        self.ServiceWorkerRegistration.sync.register('nueva-recoleccion');
        const respBodyOffline = {
            result: true,
            recolection: {
                origin: recolection.origin,
                recoleccion_id: recolection.recoleccion_id,
                alimento_id: recolection.alimento_id
            },
            offlineMode: true
        }
        const respOffline = new Response(
            JSON.stringify(respBodyOffline),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return respOffline;
    });
}

function sendPostRecolection() {
    const allPromise = [];
    db.allDocs({ include_docs: true }).then((docs) => {
        docs.rows.forEach(row => {
            const doc = row.doc;
            const prom = fetch(serverApi, {
                method: 'POST',
                body: JSON.stringify(doc),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((resp) => {
                return db.remove(doc);
            });
            allPromise.push(prom);
        });
    });
    return allPromise;
}