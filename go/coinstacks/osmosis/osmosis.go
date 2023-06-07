package osmosis

import (
	"github.com/pkg/errors"
	"github.com/xnephilim/hightable/internal/log"
	"github.com/xnephilim/hightable/pkg/cosmos"
)

var logger = log.WithoutFields()

type HTTPClient struct {
	*cosmos.HTTPClient
}

func NewHTTPClient(conf cosmos.Config) (*HTTPClient, error) {
	httpClient, err := cosmos.NewHTTPClient(conf)
	if err != nil {
		return nil, errors.Wrap(err, "failed to create new cosmos http client")
	}

	c := &HTTPClient{
		HTTPClient: httpClient,
	}

	return c, nil
}
