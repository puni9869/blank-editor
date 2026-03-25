package command

import (
	"fmt"
	"net/http"

	"github.com/puni9869/blank-editor/pkg/logger"
	"github.com/urfave/cli"
)

var log = logger.NewLogger()

var startCommand = cli.Command{
	Name:   "start",
	Usage:  "Start the Blank Editor server",
	Action: startAction,
	Flags: []cli.Flag{
		cli.StringFlag{
			Name:   "port, p",
			Usage:  "server port",
			Value:  "80",
			EnvVar: "BLANK_EDITOR_PORT",
		},
	},
}

func startAction(ctx *cli.Context) error {
	port := ctx.String("port")

	fs := http.FileServer(http.Dir("docs"))
	http.Handle("/", fs)

	addr := fmt.Sprintf(":%s", port)
	log.Infof("Blank Editor running at http://localhost%s", addr)

	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}

	return nil
}
