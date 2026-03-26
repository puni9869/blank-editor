package command

import (
	"time"

	"github.com/puni9869/blank-editor/server"
	"github.com/urfave/cli"
)

var startCommand = cli.Command{
	Name:   "start",
	Usage:  "Start the Blank Editor server",
	Action: startAction,
	Flags: []cli.Flag{
		cli.StringFlag{
			Name:   "host",
			Usage:  "bind address",
			Value:  "0.0.0.0",
			EnvVar: "BLANK_EDITOR_HOST",
		},
		cli.StringFlag{
			Name:   "port, p",
			Usage:  "server port",
			Value:  "8080",
			EnvVar: "BLANK_EDITOR_PORT",
		},
		cli.DurationFlag{
			Name:   "read-timeout",
			Usage:  "HTTP read timeout",
			Value:  15 * time.Second,
			EnvVar: "BLANK_EDITOR_READ_TIMEOUT",
		},
		cli.DurationFlag{
			Name:   "write-timeout",
			Usage:  "HTTP write timeout",
			Value:  15 * time.Second,
			EnvVar: "BLANK_EDITOR_WRITE_TIMEOUT",
		},
		cli.DurationFlag{
			Name:   "idle-timeout",
			Usage:  "HTTP idle timeout",
			Value:  60 * time.Second,
			EnvVar: "BLANK_EDITOR_IDLE_TIMEOUT",
		},
		cli.DurationFlag{
			Name:   "shutdown-timeout",
			Usage:  "graceful shutdown timeout",
			Value:  10 * time.Second,
			EnvVar: "BLANK_EDITOR_SHUTDOWN_TIMEOUT",
		},
	},
}

func startAction(ctx *cli.Context) error {
	return server.ListenAndServe(server.Config{
		Host:            ctx.String("host"),
		Port:            ctx.String("port"),
		ReadTimeout:     ctx.Duration("read-timeout"),
		WriteTimeout:    ctx.Duration("write-timeout"),
		IdleTimeout:     ctx.Duration("idle-timeout"),
		ShutdownTimeout: ctx.Duration("shutdown-timeout"),
	})
}
