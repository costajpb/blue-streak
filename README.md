# blue-streak
Dear Node.js front-end developer: you may no longer need a heavyweight IDE standing in your way to work on web-based Java applications. blue-streak shall allow for seamless Tomcat and Maven integration in Node.js environment with little configuration.

# How to use
`blue-streak` provides an easy API to perform common tasks related to building and serving web-based Java applications in Node.js environment.

## Configuration

If you have Tomcat automatically installed (e.g. via Homebrew), the only parameter you actually need to provide is the web app directory that Tomcat will serve. `blue-streak` will try to operate Tomcat instance through `catalina start` and `catalina stop` commands. You can override default configuration by placing a `.bluestreakrc` file with the custom one in the same folder where the `pom.xml` file lies.

```
# Required parameter
webAppDir = "/path/to/your/tomcat/web/app/dir"

# Default values
startup = catalina start
shutdown = catalina stop
```

Since this handles local configuration, it's suggested you to exclude `.bluestreakrc` from you VCS.

## Maven

All tasks related to building and deploying should actually be configured in the POM file you are going to run Maven on. `blue-streak` will try to run `maven clean install` Just create a profile with `blue-streak` as id like the one below:

```
...
<profile>
  <id>blue-streak</id>
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-war-plugin</artifactId>
        <configuration>
          <!-- Where do you want your web-app to be placed? The ${webAppRoot} variable passed by blue-streak is analogous to $CATALINA_BASE/webapps directory -->
          <webappDirectory>path/to/my-app</webappDirectory>
        </configuration>
        <executions>
          <execution>
            <id>war-exploded</id>
            <goals>
              <goal>exploded</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
      <plugin>
        <artifactId>maven-clean-plugin</artifactId>
        <configuration>
          <filesets>
            <fileset>
              <directory>path/to/my-app</directory>
            </fileset>
          </filesets>
        </configuration>
      </plugin>
    </plugins>
  </build>
</profile>
...
```
By default, blue-streak assumes that
Regarding to the example above, Maven will be in charge of cleaning the directory and deploying an exploded web-archive to it. You're unlikely doing changes to this.

## Tomcat

By default, blue-streak assumes that you have a global `catalina` script, so that it can use `catalina start` and `catalina stop` to start and shutdown Tomcat. There's no need to change Tomcat configurations to use blue-streak.
