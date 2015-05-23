package controllers

import java.util.UUID

import actors.session.SocketHandler
import models.user.UserId
import play.api.libs.json.JsValue
import play.api.mvc._
import actors.Actors.sessionManager
import play.api.Play.current


object Application extends Controller {

  def connect(userId: String) = WebSocket.acceptWithActor[JsValue, JsValue] { request => out =>
    SocketHandler.props(UserId(UUID.fromString(userId)), out, sessionManager)
  }

}