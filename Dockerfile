FROM jekyll/jekyll:4.4.1

WORKDIR /srv/jekyll

COPY . /srv/jekyll/

RUN jekyll build

EXPOSE 4000

CMD jekyll serve --watch --draft
