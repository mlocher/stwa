require 'date'
require 'time'
require 'faraday_middleware'
require 'faraday'
require 'json'

ENV['API_ROOT'] = "https://www.lsz-b.at/fileadmin/stwa/scripts/"
ENV['TZ'] = 'Europe/Vienna'
STWA = {
  updated_at: nil,
  source: 'https://www.lsz-b.at/sturmwarnung/',
  stations: {
    neusiedl: {
      name: "STWA Neusiedl am See",
      state: :unknown,
      coordinates: [16.83833333, 47.92666667]
    },
    breitenbrunn: {
      name: "STWA Breitenbrunn",
      state: :unknown,
      coordinates: [16.77, 47.91611111]
    },
    fertoerakos: {
      name: "STWA Fertörakos",
      state: :unknown,
      coordinates: [16.69333333, 47.72027778]
    },
    illmitz: {
      name: "STWA Illmitz",
      state: :unknown,
      coordinates: [16.7425, 47.75583333]
    },
    'illmitz-hoelle': {
      name: "STWA Illmitz Hölle",
      state: :unknown,
      coordinates: [16.78305556, 47.80361111]
    },
    moerbisch: {
      name: "STWA Mörbisch",
      state: :unknown,
      coordinates: [16.69777778, 47.75138889]
    },
    oggau: {
      name: "STWA Oggau",
      state: :unknown,
      coordinates: [16.70111111, 47.845]
    },
    podersdorf: {
      name: "STWA Podersdorf",
      state: :unknown,
      coordinates: [16.82638889, 47.86027778]
    },
    purbach: {
      name: "STWA Purbach",
      state: :unknown,
      coordinates: [16.74611111, 47.90111111]
    },
    rust: {
      name: "STWA Rust",
      state: :unknown,
      coordinates: [16.69944444, 47.80361111]
    },
    weiden: {
      name: "Weiden",
      state: :unknown,
      coordinates: [16.85222222, 47.91666667]
    }
  }
}

def stwa_status(event:, context:)
  api = Faraday.new ENV['API_ROOT'] do |c|
    c.request :json
    c.response :json, content_type: /\bjson$/
    c.adapter Faraday.default_adapter
  end

  status = api.get 'holeStwaStatus.php'
  incidents = api.get 'holeStwaDaten.php'

  # set the timestamp we got from the data
  timestamp = Time.parse(JSON.parse(incidents.body)['timestamp']).iso8601

  results = STWA
  results[:updated_at] = timestamp

  # set the status for each STWA
  for site in JSON.parse(status.body)['aaData'] do
    key = site[0].downcase.to_sym
    case site[1]
    when "#EC1C24"
      state = :gale_warning
    when "#ffc107--change-me"
      state = :advance_warning
    when '#8BC53F'
      state = :standby
    when "#6c757d--change-me"
      state = :out_of_order
    else
      state = :unknown
    end
    next unless results[:stations].key? key
    results[:stations][key][:state] = state
  end

  JSON.generate(results)
end
