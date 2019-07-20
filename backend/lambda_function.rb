require 'date'
require 'time'
require 'faraday_middleware'
require 'faraday'
require 'json'
require 'logger'

API_ROOT="https://www.lsz-b.at/fileadmin/stwa/scripts/"
ENV['TZ'] = 'Europe/Vienna'
STWA = {
  neusiedl: {
    name: "STWA Neusiedl am See",
    status: nil,
    coordinates: [16.83833333, 47.92666667]
  },
  breitenbrunn: {
    name: "STWA Breitenbrunn",
    status: nil,
    coordinates: [16.77, 47.91611111]
  },
  fertoerakos: {
    name: "STWA Fertörakos",
    status: nil,
    coordinates: [16.69333333, 47.72027778]
  },
  illmitz: {
    name: "STWA Illmitz",
    status: nil,
    coordinates: [16.7425, 47.75583333]
  },
  'illmitz-hoelle': {
    name: "STWA Illmitz Hölle",
    status: nil,
    coordinates: [16.78305556, 47.80361111]
  },
  moerbisch: {
    name: "STWA Mörbisch",
    status: nil,
    coordinates: [16.69777778, 47.75138889]
  },
  oggau: {
    name: "STWA Oggau",
    status: nil,
    coordinates: [16.70111111, 47.845]
  },
  podersdorf: {
    name: "STWA Podersdorf",
    status: nil,
    coordinates: [16.82638889, 47.86027778]
  },
  purbach: {
    name: "STWA Purbach",
    status: nil,
    coordinates: [16.74611111, 47.90111111]
  },
  rust: {
    name: "STWA Rust",
    status: nil,
    coordinates: [16.69944444, 47.80361111]
  },
  weiden: {
    name: "Weiden",
    status: nil,
    coordinates: [16.85222222, 47.91666667]
  }
}

def lambda_handler(event:, context:)
  api = Faraday.new API_ROOT do |c|
    c.request :json
    c.response :json, content_type: /\bjson$/
    c.adapter Faraday.default_adapter
  end

  status = api.get 'holeStwaStatus.php'
  incidents = api.get 'holeStwaDaten.php'

  # set the timestamp we got from the data
  timestamp = Time.parse(JSON.parse(incidents.body)['timestamp']).iso8601

  geojson = {
    type: 'FeatureCollection',
    'updated-at': timestamp,
    source: 'https://www.lsz-b.at/sturmwarnung/',
    features: []
  }

  # set the status for each STWA
  for site in JSON.parse(status.body)['aaData'] do
    key = site[0].downcase.to_sym
    case site[1]
    when "#EC1C24"
      color = "#dc3545"
      state = "Gale Warning"
    when "#ffc107--change-me"
      color = "#ffc107"
      state = "Advance Warning"
    when '#8BC53F'
      color = '#28a745'
      state = "Standby"
    when "#6c757d--change-me"
      color = "#6c757d"
      state = "Out Of Order"
    else
      color = "#f8f9fa"
      state = "Unkown"
    end
    next unless STWA.key? key

    geojson[:features] << {
      type: 'Feature',
      properties: {
        'marker-color': color,
        'marker-size': 'medium',
        'marker-symbol': 'lighthouse',
        name: STWA[key][:name],
        state: state,
        'updated-at': timestamp
      },
      geometry: {
        type: 'Point',
        coordinates: STWA[key][:coordinates]
      }
    }
  end

  JSON.generate(geojson)
end
