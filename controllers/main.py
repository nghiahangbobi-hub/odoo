from odoo import http
import json
import logging

_logger = logging.getLogger(__name__)

class OllamaChatbotController(http.Controller):

    @http.route('/ollama/chat', type='json', auth='public', methods=['POST'], csrf=False)
    def chat_with_ollama(self, **kwargs):
        _logger.info(">>> Odoo đang gọi Ollama trên máy Local...")
        
        # 1. Kiểm tra thư viện
        try:
            import requests
        except ImportError:
            return {"reply": "Lỗi: Thiếu thư viện 'requests'. Hãy chạy 'pip install requests'"}

        # 2. Lấy tin nhắn
        message = kwargs.get('message')
        if not message:
            return {"reply": "Bạn chưa nhập tin nhắn!"}

        # 3. Cấu hình URL chuẩn cho máy Windows chạy trực tiếp
        # Dùng 127.0.0.1 thay cho localhost để tránh lỗi phân giải tên miền trên Windows
        ollama_url = "http://127.0.0.1:11434/api/generate"
        
        payload = {
            "model": "llama3.1:8b", # Đảm bảo bạn đã có model này (gõ 'ollama list' để xem)
            "prompt": message,
            "stream": False
        }

        try:
            # Gửi yêu cầu
            response = requests.post(ollama_url, json=payload, timeout=60) # Tăng timeout lên 60s
            
            if response.status_code == 200:
                result = response.json()
                return {"reply": result.get('response', '')}
            else:
                return {"reply": f"Ollama báo lỗi: {response.status_code} - {response.text}"}

        except requests.exceptions.ConnectionError:
            return {"reply": "Lỗi kết nối: Odoo không tìm thấy Ollama tại 127.0.0.1:11434. Hãy chắc chắn bạn đã bật ứng dụng Ollama!"}
        except Exception as e:
            _logger.exception("Lỗi Python:")
            return {"reply": f"Lỗi lạ: {str(e)}"}