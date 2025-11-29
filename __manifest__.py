{
    'name': 'Ollama Chatbot',
    'version': '1.0',
    'category': 'Tools',
    'summary': 'Chatbot integrated with Ollama',
    'description': 'A chatbot widget integrated with Ollama API.',
    'author': 'Your Name',
    'license': 'LGPL-3',
    'depends': ['web'],
    'data': [
        'views/chatbot_template.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'ollama_chatbot/static/src/css/chat_widget.css',
            'ollama_chatbot/static/src/js/chat_widget.js',
        ],
    },
    'installable': True,
    'application': False,
}
