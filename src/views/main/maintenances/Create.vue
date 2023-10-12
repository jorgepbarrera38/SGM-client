<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12 mb-2">
                <div class="card">
                    <div class="card-header">
                        Registrar mantenimiento general
                    </div>
                    <div class="card-body">
                        <div>
                            <div class="alert alert-danger" v-show="Object.keys(errors).length > 0 ? true : false">
                                <li v-for="(error, index) in errors" :key="index">
                                    {{ error[0] }}
                                </li>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="">Tipo</label>
                                        <select class="form-control" v-model="other_maintenance.type_report">
                                            <option value="1">Digital</option>
                                            <option value="2">Físico</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="">Grupo</label>
                                        <select class="form-control" v-model="other_maintenance.group_id">
                                            <option value="">Seleccione grupo</option>
                                            <option :value="group.id" v-for="group in groups" :key="`group-${ group.id }`">
                                                {{ group.name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="">Fecha y hora inicio de realización</label>
                                        <input type="datetime-local" class="form-control" v-model="other_maintenance.date_of_realization">
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="">Fecha y hora fin de realización</label>
                                        <input type="datetime-local" class="form-control" v-model="other_maintenance.date_of_realization_ending">
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="">Clasificación del servicio</label>
                                        <select class="form-control" v-model="other_maintenance.type_maintenance_id">
                                            <option value="">Seleccione opción</option>
                                            <option :value="typeMaintenance.id" v-for="typeMaintenance in typeMaintenances" :key="`type-maint-${ typeMaintenance.id }`">
                                                {{ typeMaintenance.name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12" v-if="other_maintenance.type_report == 1">
                                    <div class="form-group">
                                        <label for="">Motivo</label>
                                        <textarea rows="3" class="form-control" v-model="other_maintenance.reason" maxlength="600"></textarea>
                                    </div>
                                </div>
                                <div class="col-md-12" v-if="other_maintenance.type_report == 1">
                                    <div class="form-group">
                                        <label for="">Descripción del soporte</label>
                                        <textarea rows="3" class="form-control" v-model="other_maintenance.support_description" maxlength="10000"></textarea>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="">Modo de falla</label>
                                        <select class="form-control" v-model="other_maintenance.failure_mode_id">
                                            <option value="">Seleccione opción</option>
                                            <option :value="failureMode.id" v-for="failureMode in failureModes" :key="`failure-mode-${ failureMode.id }`">
                                                {{ failureMode.name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                 <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="">Ubicación</label>
                                        <select class="form-control" v-model="other_maintenance.location_id">
                                            <option value="">Seleccione opción</option>
                                            <option :value="location.id" v-for="location in locations" :key="`location-${ location.id }`">
                                                {{ location.name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                 <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="">Dependencia</label>
                                        <select class="form-control" v-model="other_maintenance.dependence_id">
                                            <option value="">Seleccione opción</option>
                                            <option :value="dependence.id" v-for="dependence in dependences" :key="`dependence-${ dependence.id }`">
                                                {{ dependence.name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-6" v-if="other_maintenance.type_report == 2">
                                    <div class="form-group">
                                        <label for="">Evidencia (pdf máximo 25MB, no usar métodos de compresión)</label>
                                        <input type="file" class="form-control" @change="setFileInModel">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!--Anexos fotográficos-->
            <div class="col-md-12 mb-2" v-if="other_maintenance.type_report == 1">
                <div class="card">
                    <div class="card-header">
                        Anexos fotográficos
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="card">
                                    <div class="card-header">
                                        <span class="panel-title">
                                            Subir imagen
                                        </span>
                                    </div>
                                    <div class="card-body">
                                        <croppa
                                            v-model="myCroppa"
                                            :placeholder-font-size="14"
                                            placeholder="Seleccione imagen"
                                            :prevent-white-space="true"
                                            >
                                        </croppa>
                                        <input type="text" class="form-control mb-2" v-model="myCroppaDescription" placeholder="Descripción" maxlength="250">
                                        <button @click="myCroppa.rotate()" class="btn btn-secondary btn-sm mr-1">
                                             <i class="fa fa-sync"></i>
                                         </button>
                                        <a href="#" class="btn btn-primary btn-sm" @click.prevent="uploadImage">
                                            <i class="fa fa-upload"></i> Agregar
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-9">
                                <table class="table table-sm table-hover">
                                    <thead>
                                        <th>Imagen</th>
                                        <th>Descripción</th>
                                        <th></th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(image, index) in photographicAnnexes" :key="'image-' + index">
                                            <td><img width="110" :src="image.imageLocal" alt="" ></td>
                                            <td>{{ image.description }}</td>
                                            <td>
                                                <button class="btn btn-danger btn-sm" @click="photographicAnnexes.splice(index, 1)">
                                                    <i class="fa fa-trash-alt"></i> Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             <!--Repuestos-->
            <div class="col-md-12 mb-2">
                <div class="card">
                    <div class="card-header">
                        Repuestos
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12">
                                <form class="form-inline" @submit.prevent="addReplacement">
                                    <div class="form-group mr-sm-3 mb-2">
                                        <select class="form-control" v-model="replacementSelected">
                                            <option :value="{}">Seleccione repuesto</option>
                                            <option :value="replacement" v-for="replacement in replacements" :key="replacement.id">{{ replacement.name }}</option>
                                        </select>
                                    </div>
                                    <div class="form-group mr-sm-3 mb-2">
                                        <input type="number" class="form-control" v-model="replacementQuantity" max="100">
                                    </div>
                                    <button type="submit" class="btn btn-primary mb-2">
                                        <i class="fa fa-plus"></i> Agregar
                                    </button>
                                </form>
                                <div class="table-responsive">
                                    <table class="table table-hover table-sm">
                                        <thead>
                                            <th>Repuesto</th>
                                            <th>Cantidad</th>
                                            <th></th>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(replacement, index) in other_maintenance.replacements" :key="`replacement-${ replacement.replacement_id }`">
                                                <td>{{ replacement.name }}</td>
                                                <td>{{ replacement.quantity }}</td>
                                                <td>
                                                    <a href="#" class="btn btn-danger btn-sm" @click.prevent="deleteReplacement(index)">
                                                        <i class="fa fa-trash-alt"></i> Eliminar
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!--Verificación de lo ejecutado-->
            <div class="col-md-12 mb-2">
                <div class="card">
                    <div class="card-header">
                        <span>
                            Verificación y guardado
                        </span>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="col-md-12" v-if="other_maintenance.type_report == 1">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="">Funcionario</label>
                                                <input type="text" class="form-control" v-model="other_maintenance.official_names" maxlength="50">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="">Cargo</label>
                                                <input type="text" class="form-control" v-model="other_maintenance.official_position" maxlength="30">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 offset-md-3">
                                            <div class="form-group">
                                                <label for="">Firma</label>
                                                <div class="border border-dark">
                                                    <vueSignature ref="signature" :sigOption="option"></vueSignature> 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <center>
                                                <a href="#" class="btn btn-success btn-sm" @click.prevent="$refs.signature.clear()"><i class="fa fa-eraser"></i> Limpiar</a>
                                            </center>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr v-if="other_maintenance.type_report == 1">
                        <div class="row">
                            <div class="col-md-12">
                                <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                                <div v-else>
                                    <button @click="save" class="btn btn-primary btn-sm mr-1"><i class="fa fa-save"></i> Guardar</button>
                                    <a href="#" class="btn btn-danger btn-sm" @click.prevent="$router.go(-1)"><i class="fa fa-times-circle"></i> Cancelar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    import vueSignature from 'vue-signature'
    import AnimateScroll from 'js-animate-scroll'
    export default {
        name: 'devices.other-maintenances.create',
        components: {
            VueLoading, vueSignature
        },
        created () {
            this.getDataToCreateOtherMaintenance()
        },
        data() {
            return {
                other_maintenance: {
                    type_report: 1,
                    group_id: '',
                    official_names: '',
                    official_position: '',
                    date_of_realization: '',
                    date_of_realization_ending: '',
                    failure_mode_id: '',
                    evidence: '',
                    type_maintenance_id: '',
                    reason: '',
                    location_id: '',
                    dependence_id: '',
                    support_description: '',
                    replacements: []
                },
                myCroppa: {},
                myCroppaDescription: '',
                photographicAnnexes: [],
                failureModes: [],
                groups: [],
                typeMaintenances: [],
                replacements: [],
                replacementSelected: {},
                replacementQuantity: '',
                locations: [],
                dependences: [],
                saving: false,
                errors: {},
                option:{
                    penColor:"rgb(0, 0, 0)"
                }
            }
        },
        methods: {
            uploadImage () {
                if (!this.myCroppa.hasImage()) {
                    return this.$toastr.error('Seleccione la imagen')
                }

                this.myCroppa.generateBlob((blob) => {
                    var image = URL.createObjectURL(blob)

                    if (!this.myCroppaDescription) {
                        return this.$toastr.error('Ingrese la descripción de la imagen')
                    }

                    

                    this.photographicAnnexes.push({
                        description: this.myCroppaDescription,
                        image: blob,
                        imageLocal: image
                    })

                    this.myCroppa.remove()
                    this.myCroppaDescription = ''
                })
            },
            getDataToCreateOtherMaintenance () {
                this.$http.get('maintenances/get-data-to-create-other-maintenance').then( response => {
                    this.typeMaintenances = response.data.typeOtherMaintenances
                    this.groups = response.data.groups
                    this.replacements = response.data.replacements
                    this.locations = response.data.locations
                    this.dependences = response.data.dependences
                    this.failureModes = response.data.failureModes
                })
            },
            addReplacement () {
                if (Object.keys(this.replacementSelected).length == 0) {
                    return this.$toastr.error('Seleccione repuesto')
                }

                if (!this.replacementQuantity) {
                    return this.$toastr.error('Ingrese la cantidad')
                }

                if (this.replacementQuantity < 1) {
                    return this.$toastr.error('Cantidad no válida')
                }

                let replacementNowIsAdded = this.other_maintenance.replacements.find(replacement => replacement.replacement_id == this.replacementSelected.id)

                if (replacementNowIsAdded) {
                    this.other_maintenance.replacements = this.other_maintenance.replacements.map( replacement => {
                        if (replacement.replacement_id == this.replacementSelected.id) {
                            return { 
                                replacement_id: replacement.replacement_id, 
                                name: replacement.name,
                                quantity: parseInt(replacement.quantity) + parseInt(this.replacementQuantity)
                            }
                        } else {
                            return replacement
                        }
                    })
                } else {
                    this.other_maintenance.replacements.push({ replacement_id: this.replacementSelected.id, name: this.replacementSelected.name, quantity: this.replacementQuantity })
                }
                
                this.replacementSelected = {}
                this.replacementQuantity = ''

            },
            deleteReplacement (replacement) {
                this.other_maintenance.replacements.splice(replacement, 1)
            },
            save () {
                this.saving = true

                let data = new FormData

                data.append('date_of_realization', this.other_maintenance.date_of_realization)
                data.append('date_of_realization_ending', this.other_maintenance.date_of_realization_ending)
                data.append('type_maintenance_id', this.other_maintenance.type_maintenance_id)
                data.append('group_id', this.other_maintenance.group_id)
                data.append('reason', this.other_maintenance.reason)
                data.append('support_description', this.other_maintenance.support_description)
                data.append('failure_mode_id', this.other_maintenance.failure_mode_id)
                data.append('location_id', this.other_maintenance.location_id)
                data.append('dependence_id', this.other_maintenance.dependence_id)
                data.append('evidence', this.other_maintenance.evidence)
                data.append('replacementsInJson', JSON.stringify(this.other_maintenance.replacements))
                this.photographicAnnexes.forEach((image, index) => {
                    data.append(`photographicAnnexes[${index}][description]`, image.description)
                    data.append(`photographicAnnexes[${index}][image]`, image.image)
                })

                data.append('type_report', this.other_maintenance.type_report)

                if (this.other_maintenance.type_report == 1) {
                    if (this.$refs.signature.isEmpty()) {
                        this.saving = false
                        return this.$toastr.error('Debe firmar')
                    }
                    var _this = this
                    var png = _this.$refs.signature.save()
                    data.append('signature', png)
                    data.append('official_names', this.other_maintenance.official_names)
                    data.append('official_position', this.other_maintenance.official_position)
                }

                this.$http.post(`maintenances`, data).then( response => {
                    this.saving = false
                    this.$toastr.success('Mantenimiento general registrado')

                    if (this.other_maintenance.type_report == 1) {
                        this.$refs.signature.clear()
                    }
                    
                    this.other_maintenance.type_report = 1
                    this.other_maintenance.group_id = ''
                    this.other_maintenance.official_names = ''
                    this.other_maintenance.official_position = ''
                    this.other_maintenance.date_of_realization = ''
                    this.other_maintenance.date_of_realization_ending = ''
                    this.other_maintenance.evidence = ''
                    this.other_maintenance.type_maintenance_id = ''
                    this.other_maintenance.reason = ''
                    this.other_maintenance.support_description = ''
                    this.other_maintenance.failure_mode_id = ''
                    this.other_maintenance.location_id = ''
                    this.other_maintenance.dependence_id = ''
                    this.other_maintenance.replacements = []
                    this.photographicAnnexes = []

                    this.replacementSelected = {}
                    this.replacementQuantity = ''
                    

                    this.errors = {}

                }).catch(error => {
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                        var options = {
                            duration: 200,
                            easing: 'linear',
                            padding: -500,
                            align: 'top',
                            onFinish: function () {}
                        };
                        new AnimateScroll('#errors-validation', options)
                    }
                })
            },
            setFileInModel (e) {
                this.other_maintenance.evidence = e.target.files[0]
            }
        },
    }
</script>