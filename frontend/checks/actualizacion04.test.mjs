var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// checks/actualizacion04.test.ts
import "@angular/compiler";
import assert from "node:assert/strict";
import { createEnvironmentInjector, runInInjectionContext } from "@angular/core";
import { HttpClient as HttpClient2, HttpEventType as HttpEventType2 } from "@angular/common/http";
import { of as of4, throwError, Subject } from "rxjs";

// src/app/pages/docente/docente.ts
import { Component, inject as inject3, signal as signal2 } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { forkJoin, catchError, of } from "rxjs";
import { HttpEventType } from "@angular/common/http";

// src/app/core/services/api.ts
import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
function mensajeError(error) {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return "No se pudo conectar con el API Gateway. Comprueba Docker y el proxy de Angular.";
    if (error.status === 401) return "La sesi\xF3n no es v\xE1lida o ha caducado. Vuelve a iniciar sesi\xF3n.";
    if (error.status === 403) return "No tienes permisos para realizar esta operaci\xF3n.";
    if (error.status === 404) return "El recurso no existe o no est\xE1 disponible.";
    const body = error.error;
    if (typeof body === "string" && body.trim() && body.length < 240) return body;
    if (body && typeof body === "object") return String(body.message ?? body.detail ?? body.error ?? `Error HTTP ${error.status}`);
    return `Error HTTP ${error.status}`;
  }
  return error instanceof Error ? error.message : "Ocurri\xF3 un error inesperado.";
}
var Api = class {
  http = inject(HttpClient);
  root = "/api/v1";
  get(path) {
    return this.http.get(this.root + path);
  }
  post(path, data = {}) {
    return this.http.post(this.root + path, data);
  }
  put(path, data = {}) {
    return this.http.put(this.root + path, data);
  }
  cursos() {
    return this.get("/cursos");
  }
  publicados() {
    return this.get("/cursos/publicados");
  }
  curso(id) {
    return this.get(`/cursos/${id}`);
  }
  cursosDocente(id) {
    return this.get(`/cursos/docente/${id}`);
  }
  contenido(id) {
    return this.get(`/cursos/${id}/contenido`);
  }
  configuracionCurso(id) {
    return this.get(`/cursos/${id}/configuracion`);
  }
  crearCurso(curso2) {
    return this.post("/cursos", curso2);
  }
  actualizarCurso(id, curso2) {
    return this.put(`/cursos/${id}`, curso2);
  }
  revision(id) {
    return this.post(`/cursos/${id}/enviar-revision`);
  }
  aprobarCurso(id) {
    return this.post(`/cursos/${id}/aprobar`);
  }
  rechazarCurso(id, motivo) {
    return this.post(`/cursos/${id}/rechazar`, { motivo });
  }
  archivarCurso(id) {
    return this.post(`/cursos/${id}/archivar`);
  }
  crearModulo(id, titulo, orden) {
    return this.post(`/cursos/${id}/modulos`, { titulo, orden });
  }
  actualizarModulo(id, titulo, orden) {
    return this.put(`/modulos/${id}`, { titulo, orden });
  }
  eliminarModulo(id) {
    return this.http.delete(`${this.root}/modulos/${id}`);
  }
  actualizarLeccion(id, titulo, orden, urlContenido) {
    return this.put(`/lecciones/${id}`, { titulo, orden, urlContenido });
  }
  eliminarLeccion(id) {
    return this.http.delete(`${this.root}/lecciones/${id}`);
  }
  eliminarMaterial(id) {
    return this.http.delete(`${this.root}/materiales/${id}`);
  }
  subirMaterialProgreso(leccionId, archivo) {
    const data = new FormData();
    data.append("archivo", archivo);
    data.append("nombre", archivo.name);
    return this.http.post(`${this.root}/lecciones/${leccionId}/materiales/upload`, data, { observe: "events", reportProgress: true });
  }
  crearLeccion(id, titulo, orden, urlContenido) {
    return this.post(`/modulos/${id}/lecciones`, { titulo, orden, urlContenido });
  }
  configurarCurso(id, config2) {
    return this.put(`/cursos/${id}/configuracion`, config2);
  }
  inscripcionesEstudiante(id) {
    return this.get(`/inscripciones/estudiante/${id}`);
  }
  inscripcionesCurso(id) {
    return this.get(`/inscripciones/curso/${id}`);
  }
  crearInscripcion(estudianteId, cursoId, leccionIds, config2) {
    return this.post("/inscripciones", {
      estudianteId,
      cursoId,
      tipoAcceso: "GRATUITO",
      leccionIds,
      progresoMinimo: config2.progresoMinimo,
      asistenciaMinima: config2.asistenciaMinima,
      certificadoHabilitado: config2.certificadoHabilitado,
      certificadoCosto: config2.certificadoCosto
    });
  }
  completarLeccion(inscripcionId, leccionId) {
    return this.put(`/inscripciones/${inscripcionId}/lecciones/${leccionId}/completar`);
  }
  estadoAcademico(id) {
    return this.get(`/inscripciones/${id}/estado-academico`);
  }
  solicitarCertificado(id) {
    return this.post(`/inscripciones/${id}/certificado`);
  }
  certificado(id) {
    return this.get(`/inscripciones/${id}/certificado`);
  }
  descargarMaterial(path) {
    return this.http.get(path, { responseType: "blob" });
  }
  subirMaterial(leccionId, archivo, nombre) {
    const data = new FormData();
    data.append("archivo", archivo);
    if (nombre) data.append("nombre", nombre);
    return this.http.post(`${this.root}/lecciones/${leccionId}/materiales/upload`, data);
  }
  descargarCertificado(id) {
    return this.http.get(`${this.root}/inscripciones/${id}/certificado/pdf`, { responseType: "blob" });
  }
  notificacionesUsuario(id) {
    return this.get(`/notificaciones/usuario/${id}`);
  }
  leerNotificacion(id) {
    return this.put(`/notificaciones/${id}/leer`);
  }
  ordenesEstudiante(id) {
    return this.get(`/pagos/ordenes/estudiante/${id}`);
  }
  ordenesDocente(id) {
    return this.get(`/pagos/ordenes/docente/${id}`);
  }
  ordenes() {
    return this.get("/pagos/ordenes");
  }
  crearOrden(estudianteId, cursoId) {
    return this.post("/pagos/ordenes", { estudianteId, cursoId });
  }
  iniciarPago(id) {
    return this.post(`/pagos/ordenes/${id}/mercado-pago`);
  }
  certificadosEstudiante(id) {
    return this.get(`/pagos/certificados/ordenes/estudiante/${id}`);
  }
  crearOrdenCertificado(inscripcionId, estudianteId, cursoId) {
    return this.post("/pagos/certificados/ordenes", { inscripcionId, estudianteId, cursoId });
  }
  iniciarPagoCertificado(id) {
    return this.post(`/pagos/certificados/ordenes/${id}/mercado-pago`);
  }
  saldoDocente(id) {
    return this.get(`/pagos/docentes/${id}/saldo`);
  }
  retirosDocente(id) {
    return this.get(`/retiros/docente/${id}`);
  }
  retiros() {
    return this.get("/retiros");
  }
  solicitarRetiro(docenteId, monto, medio, destino) {
    return this.post("/retiros", { docenteId, monto, medio, destino });
  }
  aprobarRetiro(id) {
    return this.put(`/retiros/${id}/aprobar`);
  }
  pagarRetiro(id, codigoOperacion) {
    return this.put(`/retiros/${id}/pagar`, { codigoOperacion });
  }
  rechazarRetiro(id, motivo) {
    return this.put(`/retiros/${id}/rechazar`, { motivo });
  }
  reembolsos() {
    return this.get("/reembolsos");
  }
  solicitarReembolso(ordenId, motivo) {
    return this.post("/reembolsos", { ordenId, motivo });
  }
  aprobarReembolso(id) {
    return this.put(`/reembolsos/${id}/aprobar`);
  }
  rechazarReembolso(id, motivo) {
    return this.put(`/reembolsos/${id}/rechazar`, { motivo });
  }
};
Api = __decorateClass([
  Injectable({ providedIn: "root" })
], Api);

// src/app/core/services/auth.ts
import { Injectable as Injectable2 } from "@angular/core";

// src/app/core/config/keycloak.config.ts
import Keycloak from "keycloak-js";
var keycloak = new Keycloak({
  url: "http://localhost:19090",
  realm: "kido",
  clientId: "kido-frontend"
});

// src/app/core/services/auth.ts
var Auth = class {
  get autenticado() {
    return keycloak.authenticated ?? false;
  }
  get subject() {
    return keycloak.subject ?? "guest";
  }
  get usuario() {
    return keycloak.tokenParsed?.["preferred_username"] ?? "";
  }
  get roles() {
    return keycloak.realmAccess?.roles ?? [];
  }
  tieneRol(rol) {
    return this.roles.includes(rol);
  }
  obtenerPanel() {
    if (this.tieneRol("ADMIN")) return "/admin";
    if (this.tieneRol("DOCENTE")) return "/docente";
    if (this.tieneRol("ESTUDIANTE")) return "/estudiante";
    return "/";
  }
  async login() {
    await keycloak.login({
      redirectUri: window.location.origin + "/login"
    });
  }
  async logout() {
    await keycloak.logout({
      redirectUri: window.location.origin
    });
  }
};
Auth = __decorateClass([
  Injectable2({
    providedIn: "root"
  })
], Auth);

// src/app/core/services/account-context.ts
import { Injectable as Injectable3, inject as inject2, signal } from "@angular/core";
var AccountContext = class {
  auth = inject2(Auth);
  id = signal(null);
  constructor() {
    const stored = localStorage.getItem(this.key());
    const value = Number(stored);
    if (stored && Number.isSafeInteger(value) && value > 0) this.id.set(value);
  }
  key() {
    return `kido-demo-numeric-id:${this.auth.subject}`;
  }
  setId(value) {
    if (!Number.isSafeInteger(value) || value <= 0) return false;
    this.id.set(value);
    localStorage.setItem(this.key(), String(value));
    return true;
  }
  clear() {
    this.id.set(null);
    localStorage.removeItem(this.key());
  }
};
AccountContext = __decorateClass([
  Injectable3({ providedIn: "root" })
], AccountContext);

// src/app/pages/docente/docente.ts
var Docente = class {
  auth = inject3(Auth);
  account = inject3(AccountContext);
  api = inject3(Api);
  idInput = this.account.id();
  tab = signal2("cursos");
  cursos = signal2([]);
  seleccionado = signal2(null);
  alumnos = signal2([]);
  contenido = signal2(null);
  saldo = signal2(null);
  ordenes = signal2([]);
  retiros = signal2([]);
  cargando = signal2(false);
  procesando = signal2(false);
  error = signal2("");
  mensaje = signal2("");
  editar = signal2(false);
  avance = signal2(null);
  fallos = signal2([]);
  dialogo = signal2(null);
  busquedaCurso = "";
  busquedaAlumno = "";
  filtroEstado = "";
  lectura = 0;
  carga = 0;
  cursosFiltrados() {
    return this.cursos().filter((c) => c.titulo.toLowerCase().includes(this.busquedaCurso.toLowerCase()) && (!this.filtroEstado || c.estado === this.filtroEstado));
  }
  alumnosFiltrados() {
    return this.alumnos().filter((a) => `${a.id} ${a.estudianteId} ${a.estado}`.toLowerCase().includes(this.busquedaAlumno.toLowerCase()));
  }
  leccionesTotal() {
    return this.contenido()?.modulos.reduce((n, m) => n + m.lecciones.length, 0) ?? 0;
  }
  materialesTotal() {
    return this.contenido()?.modulos.reduce((n, m) => n + m.lecciones.reduce((v, l) => v + l.materiales.length, 0), 0) ?? 0;
  }
  parcial(nombre, op, vacio) {
    return op.pipe(catchError((e) => {
      this.fallos.update((v) => [...v, `${nombre}: ${mensajeError(e)}`]);
      return of(vacio);
    }));
  }
  exportarAlumnos() {
    const filas = [["Inscripcion", "Estudiante", "Progreso", "Estado"], ...this.alumnosFiltrados().map((a) => [a.id, a.estudianteId, a.porcentajeProgreso, a.estado])];
    const csv = "\uFEFF" + filas.map((f) => f.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(";")).join("\r\n");
    this.descargarBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `inscritos-curso-${this.seleccionado()?.id}.csv`);
  }
  descargarBlob(blob, nombre) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombre;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
  }
  abrirMaterial(m) {
    if (m.url.startsWith("/api/v1/materiales/archivos/")) this.api.descargarMaterial(m.url).subscribe({ next: (b) => this.descargarBlob(b, m.nombre), error: (e) => this.error.set(mensajeError(e)) });
    else if (/^https:\/\//i.test(m.url)) window.open(m.url, "_blank", "noopener,noreferrer");
  }
  editarModulo(m) {
    this.dialogo.set({ tipo: "modulo", id: m.id, titulo: m.titulo, orden: m.orden, url: "" });
  }
  editarLeccion(l) {
    this.dialogo.set({ tipo: "leccion", id: l.id, titulo: l.titulo, orden: l.orden, url: l.urlContenido || "" });
  }
  eliminar(tipo, id, titulo) {
    this.dialogo.set({ tipo, id, titulo, orden: 1, url: "" });
  }
  cerrarDialogo() {
    if (!this.procesando()) this.dialogo.set(null);
  }
  confirmarDialogo() {
    const d = this.dialogo(), curso2 = this.seleccionado()?.id;
    if (!d || !curso2 || this.procesando()) return;
    if ((d.tipo === "modulo" || d.tipo === "leccion") && (!d.titulo.trim() || !Number.isInteger(+d.orden) || +d.orden < 1)) {
      this.error.set("Escribe un t\xEDtulo y una posici\xF3n entera mayor que cero.");
      return;
    }
    if (d.tipo === "leccion" && d.url && !/^https?:\/\//i.test(d.url)) {
      this.error.set("El enlace debe comenzar con https:// o http://.");
      return;
    }
    const op = d.tipo === "modulo" ? this.api.actualizarModulo(d.id, d.titulo.trim(), +d.orden) : d.tipo === "leccion" ? this.api.actualizarLeccion(d.id, d.titulo.trim(), +d.orden, d.url) : d.tipo === "eliminarModulo" ? this.api.eliminarModulo(d.id) : d.tipo === "eliminarLeccion" ? this.api.eliminarLeccion(d.id) : this.api.eliminarMaterial(d.id);
    this.procesando.set(true);
    this.error.set("");
    op.subscribe({ next: () => {
      this.procesando.set(false);
      this.dialogo.set(null);
      this.mensaje.set("Contenido actualizado.");
      this.verContenido(curso2);
    }, error: (e) => {
      this.procesando.set(false);
      this.error.set(mensajeError(e));
    } });
  }
  formulario = { titulo: "", descripcion: "", tipo: "GRATUITO", precio: 0, docenteId: 1, categoriaId: 1, estado: "BORRADOR" };
  moduloTitulo = "";
  moduloOrden = 1;
  leccionTitulo = "";
  leccionOrden = 1;
  leccionUrl = "";
  archivo = null;
  archivoLeccionId = null;
  moduloId = null;
  retiroMonto = 50;
  retiroMedio = "CUENTA_BANCARIA";
  retiroDestino = "";
  config = { progresoMinimo: 100, asistenciaMinima: 0, certificadoHabilitado: false, certificadoCosto: 0 };
  ngOnInit() {
    if (this.account.id()) this.cargar();
  }
  guardarId() {
    if (this.cargando() || this.procesando()) return;
    if (!this.idInput || !this.account.setId(+this.idInput)) {
      this.error.set("ID num\xE9rico inv\xE1lido.");
      return;
    }
    this.formulario.docenteId = this.account.id();
    this.cargar();
  }
  cargar() {
    const id = this.account.id();
    if (!id || this.cargando()) return;
    const version = ++this.carga;
    this.error.set("");
    this.fallos.set([]);
    this.cargando.set(true);
    this.formulario.docenteId = id;
    forkJoin({ cursos: this.parcial("Cursos", this.api.cursosDocente(id), []), ordenes: this.parcial("\xD3rdenes", this.api.ordenesDocente(id), []), saldo: this.parcial("Saldo", this.api.saldoDocente(id), null), retiros: this.parcial("Retiros", this.api.retirosDocente(id), []) }).subscribe((v) => {
      if (version !== this.carga) return;
      this.cursos.set(v.cursos);
      this.ordenes.set(v.ordenes);
      this.saldo.set(v.saldo);
      this.retiros.set(v.retiros);
      this.cargando.set(false);
    });
  }
  nuevo() {
    if (this.procesando()) return;
    ++this.lectura;
    this.moduloId = null;
    this.archivoLeccionId = null;
    this.archivo = null;
    this.moduloTitulo = "";
    this.leccionTitulo = "";
    this.editar.set(false);
    this.seleccionado.set(null);
    this.contenido.set(null);
    this.formulario = { titulo: "", descripcion: "", tipo: "GRATUITO", precio: 0, docenteId: this.account.id() || 1, categoriaId: 1, estado: "BORRADOR" };
  }
  editarCurso(c) {
    if (this.procesando()) return;
    this.contenido.set(null);
    this.moduloId = null;
    this.archivoLeccionId = null;
    this.archivo = null;
    this.seleccionado.set(c);
    this.editar.set(true);
    this.formulario = { titulo: c.titulo, descripcion: c.descripcion, tipo: c.tipo, precio: c.precio, docenteId: c.docenteId, categoriaId: c.categoriaId, estado: c.estado };
    this.verContenido(c.id);
  }
  guardarCurso() {
    const id = this.account.id();
    if (!id || this.procesando()) return;
    this.formulario.titulo = this.formulario.titulo.trim();
    this.formulario.descripcion = this.formulario.descripcion.trim();
    if (!this.formulario.titulo || !this.formulario.descripcion || this.formulario.tipo === "PAGO" && (!Number.isFinite(+this.formulario.precio) || +this.formulario.precio <= 0)) {
      this.error.set("T\xEDtulo y descripci\xF3n obligatorios; un curso de pago necesita un precio mayor que cero.");
      return;
    }
    this.formulario.docenteId = id;
    if (this.formulario.tipo === "GRATUITO") this.formulario.precio = 0;
    this.procesando.set(true);
    this.error.set("");
    this.mensaje.set("");
    const op = this.editar() && this.seleccionado() ? this.api.actualizarCurso(this.seleccionado().id, this.formulario) : this.api.crearCurso(this.formulario);
    op.subscribe({ next: (r) => {
      this.procesando.set(false);
      this.mensaje.set(`Curso #${r.id} guardado. Agrega m\xF3dulos y lecciones antes de enviarlo a revisi\xF3n.`);
      this.editarCurso(r);
      this.api.cursosDocente(id).subscribe({ next: (c) => this.cursos.set(c) });
    }, error: (e) => {
      this.procesando.set(false);
      this.error.set(mensajeError(e));
    } });
  }
  accion(id, accion) {
    if (this.procesando()) return;
    this.procesando.set(true);
    this.error.set("");
    const op = accion === "revision" ? this.api.revision(id) : this.api.archivarCurso(id);
    op.subscribe({ next: (r) => {
      this.procesando.set(false);
      this.mensaje.set(`Curso #${id}: ${r.estado}`);
      this.cargar();
    }, error: (e) => {
      this.procesando.set(false);
      this.error.set(mensajeError(e));
    } });
  }
  verContenido(id) {
    const version = ++this.lectura;
    this.api.contenido(id).subscribe({ next: (c) => {
      if (version !== this.lectura || this.seleccionado()?.id !== id) return;
      this.contenido.set(c);
      this.moduloOrden = Math.max(0, ...c.modulos.map((m) => m.orden)) + 1;
      if (this.moduloId && !c.modulos.some((m) => m.id === this.moduloId)) this.moduloId = null;
      if (this.archivoLeccionId && !c.modulos.some((m) => m.lecciones.some((l) => l.id === this.archivoLeccionId))) this.archivoLeccionId = null;
      this.config = { progresoMinimo: c.configuracion.progresoMinimo, asistenciaMinima: c.configuracion.asistenciaMinima, certificadoHabilitado: c.configuracion.certificadoHabilitado, certificadoCosto: c.configuracion.certificadoCosto };
    }, error: (e) => this.error.set(mensajeError(e)) });
  }
  seleccionarModulo(id) {
    this.moduloId = id;
    const m = this.contenido()?.modulos.find((m2) => m2.id === id);
    this.leccionOrden = Math.max(0, ...m?.lecciones.map((l) => l.orden) ?? []) + 1;
  }
  crearModulo() {
    const id = this.seleccionado()?.id;
    if (this.procesando() || !id || !this.moduloTitulo.trim()) return;
    if (!Number.isInteger(+this.moduloOrden) || +this.moduloOrden < 1) {
      this.error.set("La posici\xF3n debe ser un n\xFAmero entero mayor que cero.");
      return;
    }
    if (this.contenido()?.modulos.some((m) => m.orden === +this.moduloOrden || m.titulo.toLowerCase() === this.moduloTitulo.trim().toLowerCase())) {
      this.error.set("Ya existe un m\xF3dulo con ese t\xEDtulo o posici\xF3n. Edita el existente o cambia esos datos.");
      return;
    }
    this.procesando.set(true);
    this.api.crearModulo(id, this.moduloTitulo.trim(), this.moduloOrden).subscribe({ next: () => {
      this.moduloTitulo = "";
      this.procesando.set(false);
      this.verContenido(id);
      this.mensaje.set("M\xF3dulo creado.");
    }, error: (e) => {
      this.procesando.set(false);
      this.error.set(mensajeError(e));
    } });
  }
  crearLeccion() {
    const id = this.seleccionado()?.id;
    if (this.procesando() || !id || !this.moduloId || !this.leccionTitulo.trim()) return;
    const m = this.contenido()?.modulos.find((m2) => m2.id === this.moduloId);
    if (!m) return;
    if (!Number.isInteger(+this.leccionOrden) || +this.leccionOrden < 1) {
      this.error.set("La posici\xF3n debe ser un n\xFAmero entero mayor que cero.");
      return;
    }
    if (m.lecciones.some((l) => l.orden === +this.leccionOrden || l.titulo.toLowerCase() === this.leccionTitulo.trim().toLowerCase())) {
      this.error.set("Ya existe una lecci\xF3n con ese t\xEDtulo o posici\xF3n en el m\xF3dulo.");
      return;
    }
    if (this.leccionUrl && !/^https?:\/\//i.test(this.leccionUrl)) {
      this.error.set("El enlace debe comenzar con https:// o http://.");
      return;
    }
    this.procesando.set(true);
    this.api.crearLeccion(this.moduloId, this.leccionTitulo.trim(), this.leccionOrden, this.leccionUrl).subscribe({ next: () => {
      this.leccionTitulo = "";
      this.leccionUrl = "";
      this.leccionOrden++;
      this.procesando.set(false);
      this.verContenido(id);
      this.mensaje.set("Lecci\xF3n creada.");
    }, error: (e) => {
      this.procesando.set(false);
      this.error.set(mensajeError(e));
    } });
  }
  guardarConfig() {
    const id = this.seleccionado()?.id;
    if (!id || this.procesando()) return;
    if (!this.config.certificadoHabilitado) this.config.certificadoCosto = 0;
    if (!Number.isInteger(+this.config.progresoMinimo) || !Number.isInteger(+this.config.asistenciaMinima) || this.config.progresoMinimo < 0 || this.config.progresoMinimo > 100 || this.config.asistenciaMinima < 0 || this.config.asistenciaMinima > 100 || !Number.isFinite(+this.config.certificadoCosto) || this.config.certificadoCosto < 0) {
      this.error.set("Los porcentajes deben ser enteros entre 0 y 100 y el costo no puede ser negativo.");
      return;
    }
    this.procesando.set(true);
    this.api.configurarCurso(id, this.config).subscribe({ next: () => {
      this.procesando.set(false);
      this.mensaje.set("Reglas acad\xE9micas guardadas.");
      this.verContenido(id);
    }, error: (e) => {
      this.procesando.set(false);
      this.error.set(mensajeError(e));
    } });
  }
  verAlumnos(c) {
    if (this.procesando()) return;
    ++this.lectura;
    this.contenido.set(null);
    this.alumnos.set([]);
    this.seleccionado.set(c);
    this.tab.set("alumnos");
    this.error.set("");
    this.api.inscripcionesCurso(c.id).subscribe({ next: (r) => {
      if (this.seleccionado()?.id === c.id) this.alumnos.set(r);
    }, error: (e) => this.error.set(mensajeError(e)) });
  }
  elegirArchivo(event) {
    const input = event.target;
    this.archivo = input.files?.item(0) ?? null;
    this.error.set("");
    this.avance.set(null);
    if (this.archivo && (this.archivo.size === 0 || this.archivo.size > 50 * 1024 * 1024 || !/\.(pdf|docx?|pptx?|xlsx?|txt|zip|png|jpe?g|webp|mp3|mp4|webm)$/i.test(this.archivo.name))) {
      this.archivo = null;
      input.value = "";
      this.error.set("Elige un archivo permitido, no vac\xEDo y de hasta 50 MB.");
    }
  }
  subirArchivo() {
    const cursoId = this.seleccionado()?.id;
    const leccionId = this.archivoLeccionId;
    const archivo = this.archivo;
    if (this.procesando()) return;
    if (!cursoId || !leccionId || !archivo) {
      this.error.set("Selecciona una lecci\xF3n y un archivo antes de subir el material.");
      return;
    }
    this.error.set("");
    this.mensaje.set("");
    this.procesando.set(true);
    this.avance.set(0);
    this.api.subirMaterialProgreso(leccionId, archivo).subscribe({
      next: (evento) => {
        if (evento.type === HttpEventType.UploadProgress) {
          this.avance.set(evento.total ? Math.round(100 * evento.loaded / evento.total) : null);
          return;
        }
        if (evento.type !== HttpEventType.Response) return;
        this.avance.set(100);
        const input = document.getElementById("kido-material-file");
        if (input) input.value = "";
        this.procesando.set(false);
        this.archivo = null;
        this.archivoLeccionId = null;
        this.mensaje.set("Material subido correctamente.");
        this.verContenido(cursoId);
      },
      error: (e) => {
        this.procesando.set(false);
        this.error.set(mensajeError(e));
      }
    });
  }
  seleccionarAlumnos(cursoId) {
    const curso2 = this.cursos().find((c) => c.id === Number(cursoId)) ?? null;
    ++this.lectura;
    this.contenido.set(null);
    this.seleccionado.set(curso2);
    this.alumnos.set([]);
    this.error.set("");
    if (!curso2) return;
    this.api.inscripcionesCurso(curso2.id).subscribe({
      next: (alumnos) => {
        if (this.seleccionado()?.id === curso2.id) this.alumnos.set(alumnos);
      },
      error: (e) => {
        if (this.seleccionado()?.id === curso2.id) this.error.set(mensajeError(e));
      }
    });
  }
  solicitarRetiro() {
    const id = this.account.id();
    if (!id || this.procesando()) return;
    if (!this.saldo() || this.fallos().some((f) => f.startsWith("Saldo:")) || !Number.isFinite(+this.retiroMonto) || +this.retiroMonto < 50 || +this.retiroMonto > this.saldo().disponible || !this.retiroDestino.trim()) {
      this.error.set("Revisa el saldo: m\xEDnimo S/ 50, monto no mayor al disponible y destino obligatorio.");
      return;
    }
    this.procesando.set(true);
    this.error.set("");
    this.api.solicitarRetiro(id, +this.retiroMonto, this.retiroMedio, this.retiroDestino).subscribe({ next: () => {
      this.procesando.set(false);
      this.mensaje.set("Solicitud de retiro enviada.");
      this.retiroDestino = "";
      this.cargar();
    }, error: (e) => {
      this.procesando.set(false);
      this.error.set(mensajeError(e));
    } });
  }
  cerrarSesion() {
    void this.auth.logout();
  }
};
Docente = __decorateClass([
  Component({ selector: "app-docente", standalone: true, imports: [FormsModule, RouterLink], templateUrl: "./docente.html", styleUrl: "./docente.scss" })
], Docente);

// src/app/pages/estudiante/estudiante.ts
import { Component as Component2, inject as inject4, signal as signal3 } from "@angular/core";
import { FormsModule as FormsModule2 } from "@angular/forms";
import { RouterLink as RouterLink2 } from "@angular/router";
import { forkJoin as forkJoin2, catchError as catchError2, of as of2 } from "rxjs";
var Estudiante = class {
  auth = inject4(Auth);
  account = inject4(AccountContext);
  api = inject4(Api);
  idInput = this.account.id();
  cargando = signal3(false);
  procesando = signal3(false);
  error = signal3("");
  mensaje = signal3("");
  inscripciones = signal3([]);
  ordenes = signal3([]);
  notificaciones = signal3([]);
  cursos = signal3([]);
  seleccionada = signal3(null);
  contenido = signal3(null);
  estado = signal3(null);
  certificado = signal3(null);
  tab = signal3("cursos");
  fallos = signal3([]);
  cargandoContenido = signal3(false);
  reembolso = signal3(null);
  motivoReembolso = "";
  busqueda = "";
  leccionActiva = signal3(null);
  lectura = 0;
  parcial(nombre, op, vacio) {
    return op.pipe(catchError2((e) => {
      this.fallos.update((v) => [...v, `${nombre}: ${mensajeError(e)}`]);
      return of2(vacio);
    }));
  }
  inscripcionesFiltradas() {
    return this.inscripciones().filter((i) => this.titulo(i.cursoId).toLowerCase().includes(this.busqueda.toLowerCase()));
  }
  continuar() {
    const l = this.contenido()?.modulos.flatMap((m) => m.lecciones).find((l2) => !this.completada(l2.id));
    if (l) this.leccionActiva.set(l.id);
    else this.mensaje.set("Ya completaste todas las lecciones disponibles.");
  }
  abrirLeccion(id) {
    this.leccionActiva.set(id);
  }
  abrirEnlace(url) {
    if (/^https?:\/\//i.test(url)) window.open(url, "_blank", "noopener,noreferrer");
    else this.error.set("El enlace de la lecci\xF3n debe usar http:// o https://.");
  }
  enviarReembolso() {
    const o = this.reembolso();
    if (!o || this.procesando() || !this.motivoReembolso.trim()) return;
    this.procesando.set(true);
    this.error.set("");
    this.api.solicitarReembolso(o.id, this.motivoReembolso.trim()).subscribe({ next: () => {
      this.procesando.set(false);
      this.reembolso.set(null);
      this.mensaje.set("Solicitud enviada. Administraci\xF3n revisar\xE1 el reembolso.");
    }, error: (e) => {
      this.procesando.set(false);
      this.error.set(mensajeError(e));
    } });
  }
  ngOnInit() {
    if (this.account.id()) this.cargar();
  }
  promedioProgreso() {
    const list = this.inscripciones();
    return list.length ? Math.round(list.reduce((sum, i) => sum + i.porcentajeProgreso, 0) / list.length) : 0;
  }
  noLeidas() {
    return this.notificaciones().filter((n) => !n.leida).length;
  }
  guardarId() {
    if (this.cargando() || this.procesando()) return;
    if (!this.idInput || !this.account.setId(Number(this.idInput))) {
      this.error.set("Introduce un ID num\xE9rico v\xE1lido (mayor que cero).");
      return;
    }
    this.cargar();
  }
  cargar() {
    const id = this.account.id();
    if (!id || this.cargando()) return;
    this.cargando.set(true);
    this.error.set("");
    this.fallos.set([]);
    forkJoin2({ inscripciones: this.parcial("Inscripciones", this.api.inscripcionesEstudiante(id), []), ordenes: this.parcial("Pagos", this.api.ordenesEstudiante(id), []), notificaciones: this.parcial("Notificaciones", this.api.notificacionesUsuario(id), []), cursos: this.parcial("Cat\xE1logo", this.api.publicados(), []) }).subscribe({ next: (r) => {
      this.inscripciones.set(r.inscripciones);
      this.ordenes.set(r.ordenes);
      this.notificaciones.set(r.notificaciones);
      this.cursos.set(r.cursos);
      this.cargando.set(false);
    }, error: (e) => {
      this.cargando.set(false);
      this.error.set(mensajeError(e));
    } });
  }
  titulo(cursoId) {
    return this.cursos().find((c) => c.id === cursoId)?.titulo || `Curso #${cursoId}`;
  }
  abrir(ins) {
    const version = ++this.lectura;
    this.seleccionada.set(ins);
    this.contenido.set(null);
    this.estado.set(null);
    this.certificado.set(null);
    this.leccionActiva.set(null);
    this.error.set("");
    this.cargandoContenido.set(true);
    this.api.contenido(ins.cursoId).subscribe({ next: (r) => {
      if (version !== this.lectura) return;
      this.contenido.set(r);
      this.cargandoContenido.set(false);
      this.continuar();
    }, error: (e) => {
      if (version !== this.lectura) return;
      this.cargandoContenido.set(false);
      this.error.set(mensajeError(e));
    } });
    this.api.estadoAcademico(ins.id).subscribe({ next: (r) => {
      if (version === this.lectura) this.estado.set(r);
    }, error: (e) => {
      if (version === this.lectura) this.error.set(mensajeError(e));
    } });
    this.api.certificado(ins.id).subscribe({ next: (r) => {
      if (version === this.lectura) this.certificado.set(r);
    }, error: () => {
      if (version === this.lectura) this.certificado.set(null);
    } });
  }
  completar(leccionId) {
    const ins = this.seleccionada();
    if (!ins || this.procesando()) return;
    this.procesando.set(true);
    this.error.set("");
    this.api.completarLeccion(ins.id, leccionId).subscribe({ next: (nuevo) => {
      this.procesando.set(false);
      this.seleccionada.set(nuevo);
      this.inscripciones.update((list) => list.map((x) => x.id === nuevo.id ? nuevo : x));
      this.abrir(nuevo);
      this.mensaje.set("Lecci\xF3n marcada como completada.");
    }, error: (e) => {
      this.procesando.set(false);
      this.error.set(mensajeError(e));
    } });
  }
  completada(leccionId) {
    return !!this.seleccionada()?.progresos?.some((p) => p.leccionId === leccionId && p.completada);
  }
  solicitarCertificado() {
    const ins = this.seleccionada();
    if (!ins || this.procesando()) return;
    this.procesando.set(true);
    this.error.set("");
    this.api.solicitarCertificado(ins.id).subscribe({ next: (c) => {
      this.procesando.set(false);
      this.certificado.set(c);
      this.mensaje.set(c.estado === "DISPONIBLE" ? "Certificado disponible para descargar." : "Certificado solicitado. Pendiente de pago.");
    }, error: (e) => {
      this.procesando.set(false);
      this.error.set(mensajeError(e));
    } });
  }
  pagarCertificado() {
    const ins = this.seleccionada(), id = this.account.id();
    if (!ins || !id || this.procesando()) return;
    this.procesando.set(true);
    this.error.set("");
    this.api.crearOrdenCertificado(ins.id, id, ins.cursoId).subscribe({ next: (orden) => {
      this.api.iniciarPagoCertificado(orden.id).subscribe({ next: (p) => {
        this.procesando.set(false);
        const url = p.sandboxInitPoint || p.initPoint;
        if (url && /^https:\/\//.test(url)) {
          window.open(url, "_blank", "noopener,noreferrer");
          this.mensaje.set("Se abri\xF3 Mercado Pago sandbox. La confirmaci\xF3n depende del proveedor.");
        } else this.mensaje.set(`Orden de certificado #${orden.id} creada. No existe URL de checkout configurada.`);
      }, error: (e) => {
        this.procesando.set(false);
        this.error.set(mensajeError(e));
      } });
    }, error: (e) => {
      this.procesando.set(false);
      this.error.set(mensajeError(e));
    } });
  }
  descargar() {
    const id = this.seleccionada()?.id;
    if (!id) return;
    this.api.descargarCertificado(id).subscribe({ next: (blob) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `certificado-kido-${id}.pdf`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1e3);
    }, error: (e) => this.error.set(mensajeError(e)) });
  }
  abrirMaterial(mat) {
    if (!mat.url) return;
    if (/^https:\/\//i.test(mat.url)) {
      window.open(mat.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (!mat.url.startsWith("/api/v1/materiales/archivos/")) {
      this.error.set("La ubicaci\xF3n de este material no es compatible.");
      return;
    }
    this.api.descargarMaterial(mat.url).subscribe({ next: (blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = mat.nombre || "material-kido";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1e3);
    }, error: (e) => this.error.set(mensajeError(e)) });
  }
  solicitarReembolso(orden) {
    if (orden.estado !== "APROBADA" || this.procesando()) return;
    this.motivoReembolso = "";
    this.error.set("");
    this.reembolso.set(orden);
  }
  leer(n) {
    this.api.leerNotificacion(n.id).subscribe({ next: (actual) => this.notificaciones.update((list) => list.map((x) => x.id === actual.id ? actual : x)), error: (e) => this.error.set(mensajeError(e)) });
  }
  cerrarSesion() {
    void this.auth.logout();
  }
};
Estudiante = __decorateClass([
  Component2({ selector: "app-estudiante", standalone: true, imports: [FormsModule2, RouterLink2], templateUrl: "./estudiante.html", styleUrl: "./estudiante.scss" })
], Estudiante);

// src/app/pages/admin/admin.ts
import { Component as Component3, inject as inject5, signal as signal4 } from "@angular/core";
import { RouterLink as RouterLink3 } from "@angular/router";
import { forkJoin as forkJoin3, catchError as catchError3, of as of3 } from "rxjs";
import { FormsModule as FormsModule3 } from "@angular/forms";
var Admin = class {
  auth = inject5(Auth);
  api = inject5(Api);
  cursos = signal4([]);
  ordenes = signal4([]);
  retiros = signal4([]);
  reembolsos = signal4([]);
  cargando = signal4(true);
  procesando = signal4(false);
  error = signal4("");
  mensaje = signal4("");
  tab = signal4("cursos");
  fallos = signal4([]);
  dialogo = signal4(null);
  dato = "";
  confirmado = false;
  parcial(nombre, op, vacio) {
    return op.pipe(catchError3((e) => {
      this.fallos.update((v) => [...v, `${nombre}: ${mensajeError(e)}`]);
      return of3(vacio);
    }));
  }
  necesitaDato() {
    const d = this.dialogo();
    return d?.accion === "rechazar" || d?.accion === "pagar";
  }
  tituloDialogo() {
    const d = this.dialogo();
    return d ? `${d.accion === "aprobar" ? "Aprobar" : d.accion === "rechazar" ? "Rechazar" : "Registrar pago de"} ${d.grupo} #${d.id}` : "";
  }
  abrirDialogo(grupo, id, accion) {
    if (this.procesando()) return;
    this.dato = "";
    this.confirmado = false;
    this.error.set("");
    this.dialogo.set({ grupo, id, accion });
  }
  confirmarDialogo() {
    const d = this.dialogo();
    if (!d || this.procesando() || this.necesitaDato() && !this.dato.trim() || d.accion === "pagar" && !this.confirmado) return;
    const op = d.grupo === "curso" ? d.accion === "aprobar" ? this.api.aprobarCurso(d.id) : this.api.rechazarCurso(d.id, this.dato.trim()) : d.grupo === "retiro" ? d.accion === "aprobar" ? this.api.aprobarRetiro(d.id) : d.accion === "pagar" ? this.api.pagarRetiro(d.id, this.dato.trim()) : this.api.rechazarRetiro(d.id, this.dato.trim()) : d.accion === "aprobar" ? this.api.aprobarReembolso(d.id) : this.api.rechazarReembolso(d.id, this.dato.trim());
    this.procesando.set(true);
    this.error.set("");
    op.subscribe({ next: () => {
      this.procesando.set(false);
      this.dialogo.set(null);
      this.mensaje.set("Operaci\xF3n registrada correctamente.");
      this.cargar();
    }, error: (e) => {
      this.procesando.set(false);
      this.error.set(mensajeError(e));
    } });
  }
  ngOnInit() {
    this.cargar();
  }
  cargar() {
    this.cargando.set(true);
    this.error.set("");
    this.fallos.set([]);
    forkJoin3({ cursos: this.parcial("Cursos", this.api.cursos(), []), ordenes: this.parcial("\xD3rdenes", this.api.ordenes(), []), retiros: this.parcial("Retiros", this.api.retiros(), []), reembolsos: this.parcial("Reembolsos", this.api.reembolsos(), []) }).subscribe({ next: (v) => {
      this.cursos.set(v.cursos);
      this.ordenes.set(v.ordenes);
      this.retiros.set(v.retiros);
      this.reembolsos.set(v.reembolsos);
      this.cargando.set(false);
    }, error: (e) => {
      this.cargando.set(false);
      this.error.set(mensajeError(e));
    } });
  }
  pendientes() {
    return this.cursos().filter((c) => c.estado === "PENDIENTE_REVISION");
  }
  ejecutarCurso(id, accion) {
    this.abrirDialogo("curso", id, accion);
  }
  ejecutarRetiro(id, accion) {
    this.abrirDialogo("retiro", id, accion);
  }
  ejecutarReembolso(id, accion) {
    this.abrirDialogo("reembolso", id, accion);
  }
  cerrarSesion() {
    void this.auth.logout();
  }
};
Admin = __decorateClass([
  Component3({ selector: "app-admin", standalone: true, imports: [RouterLink3, FormsModule3], templateUrl: "./admin.html", styleUrl: "./admin.scss" })
], Admin);

// checks/actualizacion04.test.ts
var count = 0;
function test(name, fn) {
  fn();
  count++;
  console.log(`OK ${count}: ${name}`);
}
var config = { cursoId: 1, progresoMinimo: 100, asistenciaMinima: 0, certificadoHabilitado: false, certificadoCosto: 0 };
var curso = { id: 1, titulo: "Python", descripcion: "Curso", tipo: "GRATUITO", precio: 0, docenteId: 1, categoriaId: 1, categoria: "Tecnolog\xEDa", estado: "BORRADOR" };
var contenido = { cursoId: 1, titulo: "Python", configuracion: config, modulos: [{ id: 3, cursoId: 1, titulo: "Introducci\xF3n", orden: 1, lecciones: [{ id: 5, moduloId: 3, titulo: "Instalaci\xF3n", orden: 1, urlContenido: "", materiales: [] }] }] };
function instance(type, api) {
  const i = createEnvironmentInjector([{ provide: Api, useValue: api }, { provide: Auth, useValue: { usuario: "Prueba" } }, { provide: AccountContext, useValue: { id: () => 1, setId: () => true } }], null);
  return runInInjectionContext(i, () => new type());
}
test("Un fallo financiero conserva los cursos del docente", () => {
  const d = instance(Docente, { cursosDocente: () => of4([curso]), ordenesDocente: () => throwError(() => new Error("Pagos ca\xEDdos")), saldoDocente: () => of4(null), retirosDocente: () => of4([]) });
  d.cargar();
  assert.equal(d.cursos().length, 1);
  assert.equal(d.fallos().length, 1);
  assert.equal(d.cargando(), false);
});
test("No se crea un m\xF3dulo con posici\xF3n duplicada", () => {
  let calls = 0;
  const d = instance(Docente, { crearModulo: () => {
    calls++;
    return of4({});
  } });
  d.seleccionado.set(curso);
  d.contenido.set(contenido);
  d.moduloTitulo = "Otro";
  d.moduloOrden = 1;
  d.crearModulo();
  assert.equal(calls, 0);
  assert.match(d.error(), /existe/);
});
test("Posiciones decimales se rechazan", () => {
  const d = instance(Docente, {});
  d.seleccionado.set(curso);
  d.moduloTitulo = "Otro";
  d.moduloOrden = 1.5;
  d.crearModulo();
  assert.match(d.error(), /entero/);
});
test("El siguiente n\xFAmero de lecci\xF3n se calcula por m\xF3dulo", () => {
  const d = instance(Docente, {});
  d.contenido.set(contenido);
  d.seleccionarModulo(3);
  assert.equal(d.leccionOrden, 2);
});
test("Un enlace de script no se guarda como contenido", () => {
  const d = instance(Docente, {});
  d.seleccionado.set(curso);
  d.contenido.set(contenido);
  d.moduloId = 3;
  d.leccionTitulo = "Nueva";
  d.leccionOrden = 2;
  d.leccionUrl = "javascript:alert(1)";
  d.crearLeccion();
  assert.match(d.error(), /https/);
});
test("La selecci\xF3n de archivos rechaza extensiones no permitidas", () => {
  const d = instance(Docente, {});
  const target = { files: { item: () => new File(["x"], "programa.exe") }, value: "programa.exe" };
  d.elegirArchivo({ target });
  assert.equal(d.archivo, null);
  assert.equal(target.value, "");
});
test("La selecci\xF3n de archivos acepta un PDF v\xE1lido", () => {
  const d = instance(Docente, {});
  d.elegirArchivo({ target: { files: { item: () => new File(["pdf"], "guia.pdf") } } });
  assert.equal(d.archivo?.name, "guia.pdf");
});
test("Doble clic no crea dos lecciones", () => {
  let calls = 0;
  const pending = new Subject();
  const d = instance(Docente, { crearLeccion: () => {
    calls++;
    return pending;
  } });
  d.seleccionado.set(curso);
  d.contenido.set(contenido);
  d.moduloId = 3;
  d.leccionTitulo = "Nueva";
  d.leccionOrden = 2;
  d.crearLeccion();
  d.crearLeccion();
  assert.equal(calls, 1);
});
test("Una respuesta antigua no reemplaza el curso actual", () => {
  const first = new Subject(), second = new Subject();
  const d = instance(Docente, { contenido: (id) => id === 1 ? first : second });
  d.seleccionado.set(curso);
  d.verContenido(1);
  d.seleccionado.set({ ...curso, id: 2 });
  d.verContenido(2);
  second.next({ ...contenido, cursoId: 2, titulo: "Actual" });
  first.next(contenido);
  assert.equal(d.contenido()?.cursoId, 2);
});
test("Continuar selecciona la primera lecci\xF3n pendiente", () => {
  const e = instance(Estudiante, {});
  e.contenido.set(contenido);
  e.continuar();
  assert.equal(e.leccionActiva(), 5);
});
test("Registrar retiro pagado requiere confirmar transferencia", () => {
  let calls = 0;
  const a = instance(Admin, { pagarRetiro: () => {
    calls++;
    return of4({});
  } });
  a.abrirDialogo("retiro", 1, "pagar");
  a.dato = "OP123";
  a.confirmarDialogo();
  assert.equal(calls, 0);
});
test("Cancelar una eliminaci\xF3n no llama al backend", () => {
  const d = instance(Docente, {});
  d.eliminar("eliminarModulo", 3, "Vac\xEDo");
  d.cerrarDialogo();
  assert.equal(d.dialogo(), null);
});
test("CRUD de contenido usa las rutas existentes del backend", () => {
  const calls = [];
  const http = { put: (...args) => {
    calls.push(["PUT", ...args]);
    return of4({});
  }, delete: (...args) => {
    calls.push(["DELETE", ...args]);
    return of4({});
  } };
  const inj = createEnvironmentInjector([{ provide: HttpClient2, useValue: http }], null);
  const api = runInInjectionContext(inj, () => new Api());
  api.actualizarModulo(3, "Nombre", 2);
  api.eliminarModulo(3);
  api.actualizarLeccion(5, "Clase", 2, "https://example.com");
  api.eliminarLeccion(5);
  api.eliminarMaterial(8);
  assert.deepEqual(calls.map((x) => x.slice(0, 2)), [["PUT", "/api/v1/modulos/3"], ["DELETE", "/api/v1/modulos/3"], ["PUT", "/api/v1/lecciones/5"], ["DELETE", "/api/v1/lecciones/5"], ["DELETE", "/api/v1/materiales/8"]]);
});
test("Subir muestra progreso y espera la respuesta para finalizar", () => {
  const eventos = new Subject();
  const d = instance(Docente, { subirMaterialProgreso: () => eventos, contenido: () => of4(contenido) });
  globalThis.document = { getElementById: () => ({ value: "guia.pdf" }) };
  d.seleccionado.set(curso);
  d.archivoLeccionId = 5;
  d.archivo = new File(["pdf"], "guia.pdf");
  d.subirArchivo();
  eventos.next({ type: HttpEventType2.UploadProgress, loaded: 50, total: 100 });
  assert.equal(d.avance(), 50);
  assert.equal(d.procesando(), true);
  eventos.next({ type: HttpEventType2.Response, body: {} });
  assert.equal(d.procesando(), false);
  assert.equal(d.archivo, null);
  delete globalThis.document;
});
test("Un fallo de notificaciones conserva las inscripciones", () => {
  const e = instance(Estudiante, { inscripcionesEstudiante: () => of4([{ id: 1 }]), ordenesEstudiante: () => of4([]), notificacionesUsuario: () => throwError(() => new Error("Ca\xEDdo")), publicados: () => of4([]) });
  e.cargar();
  assert.equal(e.inscripciones().length, 1);
  assert.equal(e.fallos().length, 1);
});
test("Administraci\xF3n conserva moderaci\xF3n si fallan retiros", () => {
  const a = instance(Admin, { cursos: () => of4([curso]), ordenes: () => of4([]), retiros: () => throwError(() => new Error("Ca\xEDdo")), reembolsos: () => of4([]) });
  a.cargar();
  assert.equal(a.cursos().length, 1);
  assert.equal(a.fallos().length, 1);
});
console.log(`${count} pruebas aprobadas. No se realizaron operaciones sobre el backend real.`);
