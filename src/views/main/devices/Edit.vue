<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Editar dispositivo
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
                                        <label for="">Grupo</label>
                                        <select class="form-control" v-model="device.group_id">
                                            <option value="">Seleccione grupo</option>
                                            <option :value="group.id" v-for="group in groups" :key="`group-${ group.id }`">
                                                {{ group.name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="">Elemento</label>
                                        <select class="form-control" v-model="device.element_id">
                                            <option value="">Seleccione elemento</option>
                                            <option :value="element.id" v-for="element in elements" :key="`element-${ element.id }`">
                                                {{ element.name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="">Serial</label>
                                        <input type="text" class="form-control" v-model="device.serial_number" maxlength="40">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="">Marca</label>
                                        <select class="form-control" v-model="device.brand_id">
                                            <option value="">Seleccione marca</option>
                                            <option :value="brand.id" v-for="brand in brands" :key="`brand-${ brand.id }`">
                                                {{ brand.name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="">Modelo</label>
                                        <input type="text" class="form-control" v-model="device.model" maxlength="40">
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="">Descripción</label>
                                        <textarea class="form-control" rows="3" v-model="device.description" maxlength="500"></textarea>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="">Observaciónes (Opcional)</label>
                                        <textarea class="form-control" rows="3" v-model="device.observations" maxlength="300"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="">Descripción de soporte para mantenimientos preventivos (Opcional)</label>
                                        <textarea class="form-control" rows="3" v-model="device.description_support_preventive_maintenance" maxlength="400"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="">Inicio de operación</label>
                                        <input type="date" class="form-control" v-model="device.start_operation">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="">Fecha fin de garantía</label>
                                        <input type="date" class="form-control" v-model="device.date_end_guarantee">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="">Vida útil (años)</label>
                                        <input type="number" class="form-control" v-model="device.useful_life">
                                    </div>
                                </div>
                            </div>

                            <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                            <div v-else>
                                <button type="submit" class="btn btn-primary btn-sm">Guardar</button>
                                <a href="" class="btn btn-danger btn-sm" @click.prevent="$router.back()">Cancelar</a>
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
        name: 'elements.edit',
        components: {
            VueLoading
        },
        created () {
            this.getDataToCreateDevice()
            this.getDevice()
        },
        data() {
            return {
                device: { 
                },
                elements: [],
                brands: [],
                saving: false,
                errors: {}
            }
        },
        methods: {
            getDataToCreateDevice () {
                this.$http.get('devices/get-data-to-create-device').then( response => {
                    this.groups = response.data.groups
                    this.elements = response.data.elements
                    this.brands = response.data.brands
                })
            },
            getDevice () {
                this.$http.get(`devices/${ this.$route.params.id }/edit`).then( response => {
                    this.device = response.data
                })
            },
            save () {
                this.saving = true
                this.$http.put(`devices/${ this.$route.params.id }`, this.device).then( response => {
                    this.$toastr.success('Dispositivo actualizado')
                    this.$router.back()
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

<style lang="scss" scoped>

</style>