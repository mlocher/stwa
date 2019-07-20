FROM ruby:2.5.5
LABEL maintainer marko.locher@segelgruppe.at

WORKDIR /app

COPY Gemfile ./
RUN bundle install

COPY . ./
CMD ["./call_lambda.rb"]
