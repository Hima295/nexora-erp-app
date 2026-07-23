FROM frappe/bench:v15.0.0

USER frappe

# Copy nexora app into bench apps folder
COPY --chown=frappe:frappe . /home/frappe/frappe-bench/apps/nexora

WORKDIR /home/frappe/frappe-bench

# Install custom app requirements
RUN ./env/bin/pip install -e ./apps/nexora

# Build assets
RUN bench build --app nexora

EXPOSE 8000 9000 8001

CMD ["bench", "start"]
