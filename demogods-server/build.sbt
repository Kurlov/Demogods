name := """demogods-server"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.6"

val akkaVersion = "2.3.11"

libraryDependencies ++= Seq(
  ws,
  "com.typesafe.akka" %% "akka-persistence-experimental" % akkaVersion,
  "com.typesafe.akka" %% "akka-testkit" % akkaVersion,
  "com.typesafe" % "config" % "1.2.1",
  "org.scalatest" % "scalatest_2.11" % "2.2.4" % "test"
)
