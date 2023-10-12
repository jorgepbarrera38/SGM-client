<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12 mb-2">
                <div class="card">
                    <div class="card-header">
                        Editar mantenimiento
                    </div>
                    <div class="card-body">
                        <div @submit.prevent="save">
                            <div class="alert alert-danger" v-show="Object.keys(errors).length > 0 ? true : false">
                                <li v-for="(error, index) in errors" :key="index">
                                    {{ error[0] }}
                                </li>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="">Tipo</label>
                                        <select class="form-control" v-model="other_maintenance.type_report" disabled>
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
<!--:class="{'col-md-6': other_maintenance.type_report == 2, 'col-md-12': other_maintenance.type_report == 1, 'col-md-12': other_maintenance.type_report == '' }">-->
                                <!--<div class="col-md-6">-->
                                    <div :class="other_maintenance.type_report == 2 ? 'col-md-6' : 'col-md-12'">
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

            <!--Listas de chequeo-->
            <div class="col-md-12 mb-2" v-if="other_maintenance.type_report == 1">
                <div class="card">
                    <div class="card-header">
                        Listas de chequeo
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12">
                                <form class="form-inline" @submit.prevent="addChecklist">
                                    <div class="form-group mr-sm-3 mb-2">
                                        <select class="form-control" v-model="checkListSelected">
                                            <option :value="{}">Seleccione lista de chequeo</option>
                                            <option :value="checklist" v-for="(checklist, index) in checklists" :key="'checklist-select-' + index">{{ checklist.name }}</option>
                                        </select>
                                    </div>
                                    <button type="submit" class="btn btn-primary mb-2">
                                        <i class="fa fa-plus"></i> Agregar
                                    </button>
                                </form>
                                <div class="table-responsive">
                                    <table class="table table-hover table-sm">
                                        <thead>
                                            <th>Lista de chequeo</th>
                                            <th></th>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(checklist, index) in other_maintenance.checklists" :key="`checklist-to-manage-${ index }`">
                                                <td>{{ checklist.name }}</td>
                                                <td>
                                                    <a href="#" class="btn btn-success btn-sm mr-1" @click.prevent="fillChecklist(checklist)">
                                                        <i class="fa fa-pen"></i> Diligenciar
                                                    </a>
                                                    <a href="#" class="btn btn-danger btn-sm" @click.prevent="deleteChecklist(index)">
                                                        <i class="fa fa-trash-alt"></i> Eliminar
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!-- Modal diligenciar lista de chequeo-->
                                <div class="modal fade" id="checklistModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Diligenciar lista de chequeo</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <!--<h5>{{ checkListSelectedItems.name }}</h5>-->
                                            <div v-for="(checklist_group, index) in checkListSelectedItems.checklist_groups" 
                                                :key="'checklist-group-' + index">
                                                <h5><strong>{{ checklist_group.name }}</strong></h5>
                                                <div class="table-responsive">
                                                    <table class="table table-hover table-sm">
                                                        <thead>
                                                            <th>Descripción</th>
                                                            <th>C</th>
                                                            <th>NC</th>
                                                            <th>NA</th>
                                                            <th></th>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="(item, index) in checklist_group.checklist_items" :key="'item-check-' + index">
                                                                <td>{{ item.description }}</td>
                                                                <td>
                                                                    <input type="radio" v-model="item.response" value="C">
                                                                </td>
                                                                <td>
                                                                    <input type="radio" v-model="item.response" value="NC">
                                                                </td>
                                                                <td>
                                                                    <input type="radio" v-model="item.response" value="NA">
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                        </div>
                                        </div>
                                    </div>
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
                            <div class="col-md-12" v-if="other_maintenance.type_report == 1">
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="">Funcionario</label>
                                        <input type="text" class="form-control" v-model="other_maintenance.official_names" maxlength="50">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="">Cargo</label>
                                        <input type="text" class="form-control" v-model="other_maintenance.official_position" maxlength="30">
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
    import vueSignature from "vue-signature"
    import moment from 'moment'
    import AnimateScroll from 'js-animate-scroll'
    export default {
        name: 'devices.other-maintenances.create',
        components: {
            VueLoading, vueSignature
        },
        created () {
            this.getOtherMaintenance()
            this.getDataToUpdateOtherMaintenance()
            var options = {
                duration: 200,
                easing: 'linear',
                padding: -500,
                align: 'top',
                onFinish: function () {}
            };
            new AnimateScroll('#errors-validation', options)
        },
        data() {
            return {
                other_maintenance: {
                    type_report: '',
                    official_names: '',
                    official_position: '',
                    date_of_realization: '',
                    date_of_realization_ending: '',
                    evidence: '',
                    type_maintenance_id: '',
                    reason: '',
                    support_description: '',
                    failure_mode_id: '',
                    replacements: [],
                    checklists: [],
                },
                myCroppa: {},
                myCroppaDescription: '',
                photographicAnnexes: [],
                typeMaintenances: [],
                failureModes: [],
                replacements: [],
                replacementSelected: {},
                checklists: [],
                checkListSelected: {},
                checkListSelectedItems: {},
                replacementQuantity: '',
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
            getOtherMaintenance () {
                this.$http.get(`other-maintenances/${ this.$route.params.idOtherMaintenance }`).then( response => {

                    this.other_maintenance.checklists = response.data.checklists

                    this.other_maintenance.type_report = response.data.type == 'Digital' ? 1 : 2
                    this.other_maintenance.date_of_realization = moment(response.data.date_of_realization).format('YYYY-MM-DDTHH:mm')
                    this.other_maintenance.date_of_realization_ending = moment(response.data.date_of_realization_ending).format('YYYY-MM-DDTHH:mm')
                    this.other_maintenance.type_maintenance_id = response.data.type_other_maintenance_id
                    this.other_maintenance.failure_mode_id = response.data.failure_mode_id
                    this.other_maintenance.reason = response.data.reason
                    this.other_maintenance.support_description = response.data.support_description
                    this.other_maintenance.official_names = response.data.official_names
                    this.other_maintenance.official_position = response.data.official_position

                    response.data.photographic_annexes.forEach(photographicAnnexe => {
                        this.$http.post('preventive-maintenances/get-blob-from-photographic-annexe', { image: photographicAnnexe.image }, { responseType: 'blob' }).then( response => {
                            this.photographicAnnexes.push({
                                description: photographicAnnexe.description,
                                image: response.data,
                                imageLocal: this.$serverFiles + photographicAnnexe.image
                            })
                        })
                    })

                    this.other_maintenance.replacements = response.data.replacements.map(replacement => {
                        return {
                            quantity: replacement.quantity,
                            name: replacement.replacement.name,
                            replacement_id: replacement.replacement_id
                        }
                    })
                })
            },
            getDataToUpdateOtherMaintenance () {
                this.$http.get('other-maintenances/get-data-to-create-other-maintenance').then( response => {
                    this.typeMaintenances = response.data.typeOtherMaintenances
                    this.replacements = response.data.replacements
                    this.failureModes = response.data.failureModes
                    this.checklists = response.data.checklists

                    this.checklists.forEach(checklist => {
                        checklist.checklist_groups.forEach(checklist_group => {
                            checklist_group.checklist_items.forEach(checklist_item => {
                                this.$set(checklist_item, 'response', '')
                            })

                        })
                    })
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
                //Verificando si tiene checklist para validar que los haya diligenciado
                let hasErrorInCheckList = false
                let message = ''
                var BreakException = {}
                try {
                    if (this.other_maintenance.checklists.length) {
                        this.other_maintenance.checklists.forEach(checklist => {
                            checklist.checklist_groups.forEach(checklist_group => {
                                checklist_group.checklist_items.forEach(checklist_item => {
                                    if (checklist_item.response != 'C' && checklist_item.response != 'NC' && checklist_item.response != 'NA') {
                                        hasErrorInCheckList = true   
                                        message = 'Hay ítems sin diligenciar en la lista de chequeo: ' + checklist.name
                                        throw BreakException
                                    }
                                })
                            })
                        })
                    }
                } catch (error) {
                }

                if (hasErrorInCheckList) {
                    return this.$toastr.error(message)
                }

                this.saving = true

                let data = new FormData //type_maintenance_id

                data.append('date_of_realization', this.other_maintenance.date_of_realization)
                data.append('date_of_realization_ending', this.other_maintenance.date_of_realization_ending)
                data.append('type_maintenance_id', this.other_maintenance.type_maintenance_id)
                data.append('reason', this.other_maintenance.reason)
                data.append('support_description', this.other_maintenance.support_description)
                data.append('failure_mode_id', this.other_maintenance.failure_mode_id)
                data.append('evidence', this.other_maintenance.evidence)
                data.append('replacementsInJson', JSON.stringify(this.other_maintenance.replacements))
                this.photographicAnnexes.forEach((image, index) => {
                    data.append(`photographicAnnexes[${index}][description]`, image.description)
                    data.append(`photographicAnnexes[${index}][image]`, image.image)
                })
                data.append('_method', 'PUT')

                data.append('type_report', this.other_maintenance.type_report)

                if (this.other_maintenance.type_report == 1) {
                    if (this.$refs.signature.isEmpty()) {
                        this.saving = false
                        return this.$toastr.error('Debe firmar')
                    }
                    var _this = this
                    var png = _this.$refs.signature.save()
                    data.append('signature', png)

                    data.append('checklists', JSON.stringify(this.other_maintenance.checklists))
                    
                    data.append('official_names', this.other_maintenance.official_names)
                    data.append('official_position', this.other_maintenance.official_position)
                }

                this.$http.post(`other-maintenances/${ this.$route.params.idOtherMaintenance }`, data).then( (response) => {
                    this.saving = false
                    this.$toastr.success('Mantenimiento actualizado')
                    this.$router.go(-1)
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
                    if (error.response.status == 403) {
                        this.$router.go(-1)
                        this.$toastr.error('Solo puede editar sus propios registros')
                    }
                })
            },
            setFileInModel (e) {
                this.other_maintenance.evidence = e.target.files[0]
            },
            addChecklist () {
                if (Object.keys(this.checkListSelected).length == 0) {
                    return this.$toastr.error('Seleccione lista de chequeo')
                }

                let checklistIsTheList = this.other_maintenance.checklists.some(checklist => checklist.name == this.checkListSelected.name)

                if (checklistIsTheList) {
                    return this.$toastr.error('Lista de chequeo ya se encuentra agregada')
                }

                this.other_maintenance.checklists.push({ id: this.checkListSelected.id, name: this.checkListSelected.name, checklist_groups: this.checkListSelected.checklist_groups })

                this.checkListSelected = {}
            },
            fillChecklist (checklist) {
                this.checkListSelectedItems = checklist
                $('#checklistModal').modal('show')
            },
            deleteChecklist (index) {
                this.other_maintenance.checklists.splice(index, 1)
            }
        },
    }
</script>