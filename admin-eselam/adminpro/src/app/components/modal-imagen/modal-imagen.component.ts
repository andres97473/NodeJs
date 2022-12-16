import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [],
})
export class ModalImagenComponent implements OnInit {
  public imagenSubir?: File;
  public imgTemp: any = null;

  public message: any;
  public enviado = false;
  public enviando = false;
  private _value: number = 0;

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    if (!isNaN(value) && value <= 100) {
      this._value = value;
    }
  }

  constructor(
    public modalImagenService: ModalImagenService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {}

  cerrarModal() {
    this.imgTemp = null;
    this.message = null;
    this.enviado = false;
    this.enviando = false;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen(event: any): any {
    const file = event.target.files[0];
    this.imagenSubir = file;
    this.message = null;
    this.enviado = false;
    this.enviando = false;
    // console.log(this.imagenSubir);

    // si se selecciona imagen cambiar la vista por la nueva imagen
    if (!file) {
      return (this.imgTemp = null);
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      // console.log(reader.result);
    };
  }

  subirImagen() {
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;
    this.enviado = true;

    if (this.imagenSubir && id) {
      this.fileUploadService
        .actualizarFoto(this.imagenSubir, tipo, id)
        .pipe()
        .subscribe(
          (resp: any) => {
            this.message = null;
            this.enviando = true;

            if (resp['loaded'] && resp['total']) {
              this.value = Math.round((resp['loaded'] / resp['total']) * 100);
            }

            if (resp['body']) {
              this.message = resp['body'].msg;
            }

            if (this.message) {
              // emitir nueva imagen
              this.modalImagenService.nuevaImagen.emit(
                resp['body'].nombreArchivo
              );
              this.cerrarModal();
              this.message = null;
              this.enviado = false;
              this.enviando = false;
              this.value = 0;
              this.imgTemp = null;
            }
          },
          (err) => {
            console.log(err);
            Swal.fire('Error', 'No se pudo subir la imagen', 'error');
          }
        );
    }
  }
}
