package actors.session

import play.api.libs.json.JsValue
import SocketProtocol.WebSocketMessage

trait JsonSocketHelper {
  def fromJson(json: JsValue): Option[WebSocketMessage]
  def toJson(message: WebSocketMessage): JsValue
  def wrapUnknown(json: JsValue): JsValue
}


