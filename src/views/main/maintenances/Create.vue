<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Registrar mantenimiento general
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="save">
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
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="">Motivo</label>
                                        <input type="text" class="form-control" v-model="other_maintenance.reason" maxlength="400">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="">Conclusión</label>
                                        <input type="text" class="form-control" v-model="other_maintenance.conclusion" maxlength="400">
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
                                <div class="col-md-12">
                                    <label for="">Repuestos</label>
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
                            <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                            <div v-else>
                                <button type="submit" class="btn btn-primary btn-sm mr-1"><i class="fa fa-save"></i> Guardar</button>
                                <a href="#" class="btn btn-danger btn-sm" @click.prevent="$router.go(-1)"><i class="fa fa-times-circle"></i> Cancelar</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    import vueSignature from 'vue-signature'
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
                    conclusion: '',
                    replacements: []
                },
                failureModes: [],
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
            getDataToCreateOtherMaintenance () {
                this.$http.get('maintenances/get-data-to-create-other-maintenance').then( response => {
                    this.typeMaintenances = response.data.typeOtherMaintenances
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
                data.append('reason', this.other_maintenance.reason)
                data.append('conclusion', this.other_maintenance.conclusion)
                data.append('failure_mode_id', this.other_maintenance.failure_mode_id)
                data.append('location_id', this.other_maintenance.location_id)
                data.append('dependence_id', this.other_maintenance.dependence_id)
                data.append('evidence', this.other_maintenance.evidence)
                data.append('replacementsInJson', JSON.stringify(this.other_maintenance.replacements))

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
                    this.other_maintenance.official_names = ''
                    this.other_maintenance.official_position = ''
                    this.other_maintenance.date_of_realization = ''
                    this.other_maintenance.date_of_realization_ending = ''
                    this.other_maintenance.evidence = ''
                    this.other_maintenance.type_maintenance_id = ''
                    this.other_maintenance.reason = ''
                    this.other_maintenance.conclusion = ''
                    this.other_maintenance.failure_mode_id = ''
                    this.other_maintenance.location_id = ''
                    this.other_maintenance.dependence_id = ''
                    this.other_maintenance.replacements = []

                    this.replacementSelected = {}
                    this.replacementQuantity = ''
                    

                    this.errors = {}

                }).catch(error => {
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            },
            setFileInModel (e) {
                this.other_maintenance.evidence = e.target.files[0]
            }
        },
    }
</script>