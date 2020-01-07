FROM jekyll/jekyll:3.8.5

WORKDIR /srv/jekyll

COPY . /srv/jekyll/

RUN jekyll build

EXPOSE 4000

CMD jekyll serve --watch --draft
