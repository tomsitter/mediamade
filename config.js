var config = {};

config.db = {
    'test': 'mongodb://localhost/contacts-test',
    'dev': 'mongodb://localhost/mediamade'
};

config.cloundinary = {
    'cloud_name': 'mediamade',
    'api_key': '866212341591316',
    'api_secret': 'vhl4aAaTBryVP_YBZ0qAAsyBL3o'
};

config.paginate = {
    'defaultLimit': 10,
    'maxLimit': 20
}

module.exports = config;