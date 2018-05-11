var chiper = require("../crypto/chiper").Chiper();

/* Exports */
module.exports = {
    sendToOne: function(clients, users, data, user, type, secret_keys) {
        var receiver_id = 0;
        for(var client in clients) {
            if(clients[client].un == user) {
                // console.log(data.message);
                // const plaintext = chiper.decrypt(data.message,secret_keys[data.id.toString()]);
                // const chipertext = chiper.encrypt(plaintext, secret_keys[clients[client].id.toString()]);
                // data.message = chipertext;
                console.log(data.message);                
                if(type == 'message') {
                    clients[client].con.write(JSON.stringify(secret_keys));
                    clients[client].con.write(JSON.stringify(clients[client].id));
                    clients[client].con.write(JSON.stringify(data));
                }
                if(type == 'role') {
                    clients[client].role = data.role;
                    users[clients[client].id].role = data.role;
                }
            } else {
                receiver_id++;
            }
        }
    },

    sendToAll: function (clients, data, secret_keys) {
        for(var client in clients) {
            if(clients[client].role > 1 && (data.info === 'connection' || data.info === 'disconnection')) {
                data.user.ip = module.exports.getUserByID(clients, data.user.id).ip;
            } else if(data.user) {
                delete data.user.ip;
            }

            clients[client].con.write(JSON.stringify(data));
        }
    },

    sendBack: function(clients, data, user) {
        // log("data : " + data);
        clients[user.con.id].con.write(JSON.stringify(data));
    },

    checkUser: function(clients, user) {
        for(var client in clients) {
            if(clients[client].un === user) {
                return true;
            }
        }
        return false;
    },

    getUserByName: function(clients, name) {
        for(client in clients) {
            if(clients[client].un === name) {
                return clients[client];
            }
        }
    },

    getUserByID: function(clients, id) {
        for(client in clients) {
            if(clients[client].id === id) {
                return clients[client];
            }
        }
    },

    normalizePort: function(val) {
        var port = parseInt(val, 10);

        if(isNaN(port)) {
            return val;
        }

        if(port >= 0) {
            return port;
        }

        return false;
    }
}