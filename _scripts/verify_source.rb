#!/usr/bin/env ruby
# frozen_string_literal: true

# Validate source files before Jekyll runs. This intentionally uses only Ruby's
# standard library so it can catch broken front matter even before bundle install.

require "date"
require "pathname"
require "set"
require "uri"
require "yaml"

ROOT = Pathname.new(__dir__).join("..").expand_path
MINIMUM_PAPER_REVIEWS = 38
TEXT_EXTENSIONS = %w[.md .html .scss .yml .yaml .json .xml .js .rb .py .sh].freeze
LIQUID_PAIRS = {
  "if" => "endif",
  "unless" => "endunless",
  "for" => "endfor",
  "case" => "endcase",
  "capture" => "endcapture",
  "comment" => "endcomment",
  "raw" => "endraw",
  "tablerow" => "endtablerow"
}.freeze

errors = []
documents = []


def relative(path)
  path.relative_path_from(ROOT).to_s
end


def front_matter(text, path, errors)
  lines = text.lines
  return [nil, text] unless lines.first&.strip == "---"

  closing_index = lines.each_index.drop(1).find { |index| lines[index].strip == "---" }
  unless closing_index
    errors << "#{relative(path)}: front matter closing marker is missing"
    return [nil, text]
  end

  yaml_text = lines[1...closing_index].join
  body = lines[(closing_index + 1)..]&.join.to_s
  data = if yaml_text.strip.empty?
           {}
         else
           YAML.safe_load(
             yaml_text,
             permitted_classes: [Date, Time],
             aliases: true,
             filename: relative(path)
           ) || {}
         end
  unless data.is_a?(Hash)
    errors << "#{relative(path)}: front matter must be a mapping"
    data = {}
  end
  [data, body]
rescue Psych::SyntaxError => e
  errors << "#{relative(path)}: invalid YAML front matter (#{e.message.lines.first.strip})"
  [nil, body || text]
end


def nonempty?(value)
  !(value.nil? || value == "" || (value.respond_to?(:empty?) && value.empty?))
end


def valid_http_url?(value)
  uri = URI.parse(value.to_s)
  %w[http https].include?(uri.scheme) && nonempty?(uri.host)
rescue URI::InvalidURIError
  false
end

# UTF-8, front matter and Liquid structure.
Dir.glob(ROOT.join("**", "*").to_s, File::FNM_DOTMATCH).sort.each do |name|
  path = Pathname.new(name)
  next unless path.file?
  next if path.each_filename.any? { |part| %w[.git vendor _site .bundle .jekyll-cache].include?(part) }
  next unless TEXT_EXTENSIONS.include?(path.extname.downcase)

  begin
    text = path.read(encoding: "UTF-8")
  rescue Encoding::InvalidByteSequenceError, Encoding::UndefinedConversionError => e
    errors << "#{relative(path)}: not valid UTF-8 (#{e.message})"
    next
  end

  data, body = front_matter(text, path, errors)
  documents << [path, data, body] if data

  stack = []
  text.to_enum(:scan, /{%\s*([A-Za-z_]+)/).each do
    tag = Regexp.last_match(1)
    if LIQUID_PAIRS.key?(tag)
      stack << tag
    elsif LIQUID_PAIRS.value?(tag)
      opener = LIQUID_PAIRS.key(tag)
      if stack.last == opener
        stack.pop
      else
        errors << "#{relative(path)}: unexpected Liquid tag #{tag}"
      end
    end
  end
  errors << "#{relative(path)}: unclosed Liquid tag(s): #{stack.join(', ')}" unless stack.empty?
end

layouts = Set.new(Dir.glob(ROOT.join("_layouts", "*.html").to_s).map { |path| File.basename(path, ".html") })
includes = Set.new(Dir.glob(ROOT.join("_includes", "*.html").to_s).map { |path| File.basename(path) })
seen_routes = {}
posts = []
papers = []

# Layout/include references and post metadata.
documents.each do |path, data, body|
  layout = data["layout"]
  if nonempty?(layout) && !layouts.include?(layout.to_s)
    errors << "#{relative(path)}: unknown layout '#{layout}'"
  end

  text = path.read(encoding: "UTF-8")
  text.scan(/{%\s*include\s+([^\s%}]+)/).flatten.each do |include_name|
    clean_name = include_name.delete("'\"")
    next if clean_name.include?("{{")
    errors << "#{relative(path)}: unknown include '#{clean_name}'" unless includes.include?(clean_name)
  end

  next unless path.dirname == ROOT.join("_posts")

  posts << [path, data, body]
  %w[layout title date categories tags summary].each do |key|
    errors << "#{relative(path)}: required front matter '#{key}' is missing" unless nonempty?(data[key])
  end

  unless data["categories"].is_a?(Array)
    errors << "#{relative(path)}: categories must be an array"
  end
  unless data["tags"].is_a?(Array)
    errors << "#{relative(path)}: tags must be an array"
  end

  filename_slug = path.basename(".md").to_s.sub(/^\d{4}-\d{2}-\d{2}-/, "")
  route_key = data["permalink"] || data["slug"] || filename_slug
  if seen_routes.key?(route_key.to_s)
    errors << "#{relative(path)}: duplicate post route key '#{route_key}' also used by #{seen_routes[route_key.to_s]}"
  else
    seen_routes[route_key.to_s] = relative(path)
  end

  if data["image"].to_s.start_with?("/")
    asset = ROOT.join(data["image"].to_s.delete_prefix("/"))
    errors << "#{relative(path)}: image does not exist: #{data['image']}" unless asset.file?
  end

  is_paper = data["paper"] == true || Array(data["categories"]).map(&:to_s).include?("papers")
  next unless is_paper

  papers << [path, data, body]
  %w[venue paper_year paper_authors reviewed_on takeaways].each do |key|
    errors << "#{relative(path)}: paper metadata '#{key}' is missing" unless nonempty?(data[key])
  end

  year = data["paper_year"].to_i
  errors << "#{relative(path)}: paper_year is out of range" unless year.between?(1900, 2100)

  takeaways = data["takeaways"]
  unless takeaways.is_a?(Array) && takeaways.length == 3 && takeaways.all? { |item| nonempty?(item) }
    errors << "#{relative(path)}: takeaways must contain exactly three non-empty items"
  end

  source_fields = %w[source_url pdf_url code_url legacy_url].select { |key| nonempty?(data[key]) }
  if (source_fields & %w[source_url pdf_url]).empty?
    errors << "#{relative(path)}: paper must include source_url or pdf_url"
  end
  source_fields.each do |key|
    errors << "#{relative(path)}: #{key} is not an absolute HTTP(S) URL" unless valid_http_url?(data[key])
  end

  plain_body = body.gsub(/<[^>]+>/, " ").gsub(/[`*_>#\[\]()|-]/, " ")
  word_count = plain_body.scan(/\S+/).length
  errors << "#{relative(path)}: paper note is too short (#{word_count} tokens; minimum 300)" if word_count < 300
  errors << "#{relative(path)}: iframe embeds are not allowed in rewritten paper notes" if body.match?(/<iframe\b/i)
end

if papers.length < MINIMUM_PAPER_REVIEWS
  errors << "paper archive has #{papers.length} reviews; expected at least #{MINIMUM_PAPER_REVIEWS}"
end

# Core source files and import targets.
%w[
  _config.yml
  Gemfile
  Gemfile.lock
  assets/css/main.scss
  _sass/_field-notes.scss
  assets/js/app.js
  assets/icons.svg
  assets/img/og-card.png
  search.json
  site.webmanifest
  .github/workflows/pages.yml
].each do |name|
  errors << "missing required source: #{name}" unless ROOT.join(name).file?
end

main_scss = ROOT.join("assets/css/main.scss").read(encoding: "UTF-8")
errors << "assets/css/main.scss must import field-notes" unless main_scss.match?(/@import\s+["']field-notes["']/)

if errors.any?
  warn "Source validation failed with #{errors.length} error(s):"
  errors.each { |error| warn "  - #{error}" }
  exit 1
end

puts "Source validation passed: #{documents.length} front-matter documents, #{posts.length} posts, #{papers.length} paper/benchmark notes."
