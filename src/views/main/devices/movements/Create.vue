<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Registrar movimiento
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="save" class="form-row">
                            <div class="col-md-12">
                                <div class="alert alert-danger" v-show="Object.keys(errors).length > 0 ? true : false">
                                    <li v-for="(error, index) in errors" :key="index">
                                        {{ error[0] }}
                                    </li>
                                </div>
                            </div>

                            <div class="form-group col-md-6">
                                <label for="">Ubicación</label>
                                <select class="form-control" v-model="movement.location_id">
                                    <option value="">Seleccione ubicación</option>
                                    <option :value="location.id" v-for="location in locations" :key="`location-${ location.id }`">
                                        {{ location.id == currentMovement.location_id ? 'Actual: ' : '' }}{{ location.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="">Dependencia</label>
                                <select class="form-control" v-model="movement.dependence_id">
                                    <option value="">Seleccione dependencia</option>
                                    <option :value="dependence.id" v-for="dependence in dependences" :key="`dependence-${ dependence.id }`">
                                        {{ dependence.id == currentMovement.dependence_id ? 'Actual: ' : '' }}{{ dependence.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="">Responsable</label>
                                <select class="form-control" v-model="movement.responsible_id">
                                    <option value="">Seleccione dependencia</option>
                                    <option :value="responsible.id" v-for="responsible in responsibles" :key="`responsible-${ responsible.id }`">
                                        {{ responsible.id == currentMovement.responsible_id ? 'Actual: ' : '' }}{{ responsible.fullnames }}
                                    </option>
                                </select>
                            </div>

                            <div class="form-group col-md-12">
                                <label for="">Observación</label>
                                <textarea rows="3" class="form-control" v-model="movement.observations" maxlength="150"></textarea>
                            </div>
                            <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                            <div v-else class="col-md-12">
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
    export default {
        name: 'devices.movements.create',
        components: {
            VueLoading
        },
        created () {
            this.getDataToCreateMovement()
        },
        data() {
            return {
                currentMovement: {
                    location_id: '',
                    dependence_id: '',
                    responsible_id: ''
                },
                locations: [],
                dependences: [],
                responsibles: [],
                movement: {
                    location_id: '',
                    dependence_id: '',
                    responsible_id: '',
                    observations: ''
                },
                saving: false,
                errors: {}
            }
        },
        methods: {
            getDataToCreateMovement() {
                this.$http.get(`movements/get-data-to-create-movement/${ this.$route.params.id }`).then( response => {
                    this.currentMovement = response.data.currentMovement
                    this.locations = response.data.locations
                    this.dependences = response.data.dependences
                    this.responsibles = response.data.responsibles
                })
            },
            save () {
                this.saving = true
                this.$http.post(`movements/${ this.$route.params.id }`, this.movement).then( response => {
                    this.saving = false
                    this.$toastr.success('Movimiento registrado')
                    this.$router.go(-1)
                }).catch(error => {
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            }
        },
    }
</script>