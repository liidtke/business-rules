<script context="module" lang="ts">
  export interface IRule {
    id?: string;
    code: string;
    title: string;
    text: string;
    areaId: string;
    status: string;
    tags: string[];
    _isVisible?: boolean;
  }

  export interface IArea {
    id?: string;
    name: string;
    rules: IRule[];
    prefix: string;
    startNumber: number;
    currentNumber: number;

    _hasChild?: boolean;
  }
</script>

<script lang="ts">
  import { user, canWrite } from "../store";
  import { replace, push } from "svelte-spa-router";
  import Editor from "../components/Editor.svelte";
  import Tags from "../components/Tags.svelte";
  import Nip from "../components/Nip.svelte";
  import Message from "../components/Message.svelte";
  import { warning, success } from "../components/toaster";
  import { onMount } from "svelte";
  import { Service } from "../service";

  export let params = {};
  const service: Service = new Service();

  //model
  let areas: IArea[] = [];
  let status: any[];
  let selectedArea: IArea;
  let selectedRule: any;
  let errorMessage: string;
  let validationFields: any[];

  let search: string = "";

  //behavior
  onMount(async () => {
    areas = await service.getAreas();
    status = service.getStatus();
    if (params.id) {
      replaceRule(params.id);
    }
  });

  $: filteredAreas = !search ? areas : searchAreas(search);
  $: codeError =
    validationFields && validationFields.find((v) => v.field == "code");
  $: titleError =
    validationFields && validationFields.find((v) => v.field == "title");
  $: areaError =
    validationFields && validationFields.find((v) => v.field == "areaId");
  $: statusError =
    validationFields && validationFields.find((v) => v.field == "status");

  //functions
  function replaceRule(id) {
    if (!areas || selectedRule) {
      return;
    }

    areas.forEach((area) => {
      if (area.rules) {
        let index = area.rules.findIndex((x) => x.id == id);
        if (index > -1) {
          selectedRule = area.rules[index];
          return;
        }
      }
    });
  }

  function searchAreas(search) {
    search = search.toLowerCase();

    return areas.filter((area) => {
      //filtra filhos

      if (area._hasChild === undefined) {
        area._hasChild = false;
      }

      if (area.rules) {
        area.rules.forEach((r) => {
          r._isVisible =
            r.code.toLowerCase().includes(search) ||
            r.title.toLowerCase().includes(search);
        });

        area._hasChild = area.rules.findIndex((r) => r._isVisible) > -1;
      }

      return area.name.toLowerCase().includes(search) || area._hasChild;
    });
  }

  function addArea(area) {
    selectedRule = null;
    selectedArea = { ...area };
  }

  async function saveArea() {
    validationFields = [];
    if (!selectedArea || !selectedArea.name) {
      return;
    }

    let result = await service.saveArea(selectedArea);

    if (result.isError) {
      warning(result.message ?? "Erro ao salvar");
      return;
    }

    if (!selectedArea.id) {
      areas.unshift(result.data);
    } else {
      let index = areas.findIndex((x) => x.id == selectedArea.id);
      if (index > -1) {
        areas[index] = selectedArea;
      }
    }

    selectedArea = null;
    areas = areas;
  }

  function removeArea() {
    if (selectedArea) {
      let index = areas.findIndex((x) => x.id == selectedArea.id);
      if (index > -1) {
        areas.splice(index, 1);
        selectedArea = null;
        areas = areas;
      }
    }
  }

  function cancelArea() {
    validationFields = [];
    selectedArea = null;
  }

  function addRule(area) {
    validationFields = [];
    errorMessage = null;
    selectedArea = null;
    selectedRule = { areaId: area.id, status: "Proposed" };
  }

  function editRule(rule) {
    selectedArea = null;
    validationFields = [];
    selectedRule = { ...rule };
    replace("/rules/" + rule.id);
  }

  async function saveRule() {
    validationFields = [];
    errorMessage = null;

    let result = await service.saveRule(selectedRule);
    if (result.isError) {
      errorMessage = result.message;
      if (result.isValidation) {
        validationFields = result.validations;
      }
    } else {
      success("Salvo com sucesso");
      if (result.data) {
        updateRule(result.data);
      }
      selectedRule = null;
    }
    console.log(selectedRule, "rule");
  }

  function cancelRule() {
    validationFields = [];
    selectedRule = null;
    replace("/rules/");
  }

  function handleTags(event) {
    selectedRule.tags = event.detail.tags;
  }

  function updateRule(rule) {
    areas.forEach((area) => {
      if (area.id == rule.areaId) {
        let index = area.rules.findIndex((x) => x.id == rule.id);
        if (index > -1) {
          area.rules[index] = rule;
        } else {
          area.rules.push(rule);
        }
        areas = areas;
        return;
      }
    });
  }
</script>

<div class="v-section">
  <h1 class="is-size-2">Regras de Negócio</h1>
  <p>Lista de regras de negócio</p>
  {#if !$canWrite}
    <p>Somente Leitura</p>
  {/if}
</div>

<div class="columns is-variable is-6">
  <div class="column">
    <div class="brules-menu">
      <!-- <p class="title">Áreas</p> -->

      <input
        class="input search"
        type="text"
        placeholder="Buscar"
        bind:value={search}
      />

      <a class="action add-area" on:click={addArea}>Adicionar Área</a>

      {#each filteredAreas as area}
        <div class="area">
          <a class="lbl" on:click={addArea(area)}>{area.name}</a>
          <a class="action" on:click={addRule(area)}>Adicionar Regra</a>
          <div class="items">
            {#if area.rules}
              <!-- content here -->
              {#each area.rules as rule}
                <a
                  class="item {selectedRule && selectedRule.id == rule.id
                    ? 'is-active'
                    : ''} {rule._isVisible ? 'stronger' : ''}"
                  on:click={editRule(rule)}
                >
                  {rule.code} - {rule.title}
                </a>
              {/each}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Regra -->
  <div class="column is-two-thirds">
    {#if selectedRule}
      <div class="columns is-variable is-0">
        <div class="column noptop">
          {#if selectedRule.id}
            <h3 class="subtitle">Regra</h3>
            <h3 class="title">
              {selectedRule.code}
            </h3>
            <h3 class="subtitle">{selectedRule.title}</h3>
          {:else}
            <h3 class="title">Nova Regra</h3>
          {/if}
        </div>
        <div class="column noptop">
          <div class="field is-grouped is-grouped-right">
            <p class="control">
              <a class="button is-light" on:click={cancelRule}> Cancelar </a>
            </p>
            <p class="control">
              <a class="button is-primary" on:click={saveRule}> Salvar </a>
            </p>
          </div>
        </div>
      </div>

      <Message bind:text={errorMessage} />

      <div class="columns is-variable is-0" style="margin-bottom:0px;">
        <div class="column">
          <Tags on:tags={handleTags} bind:tags={selectedRule.tags} />
        </div>
        <div class="column sm-options">
          <div class="field is-grouped is-grouped-right">
            <div class="control">
              <div class="select is-small {areaError ? 'is-danger' : ''}">
                <select bind:value={selectedRule.areaId}>
                  <option value={null}> Selecione </option>
                  {#each areas as aSelect}
                    <option value={aSelect.id}>
                      {aSelect.name}
                    </option>
                  {/each}
                </select>
              </div>
            </div>

            <div class="control">
              <div class="select is-small {statusError ? 'is-danger' : ''}">
                <select bind:value={selectedRule.status}>
                  <option value={null}>Selecione</option>
                  {#each status as sStatus}
                    <option value={sStatus.id}>
                      {sStatus.name}
                    </option>
                  {/each}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form">
        <div class="field">
          <label class="label">Código</label>
          <div class="control">
            <input
              class="input {codeError ? 'is-danger' : ''}"
              type="text"
              placeholder="Código gerado automaticamente"
              bind:value={selectedRule.code}
              disabled={!selectedRule.id}
            />
          </div>
          {#if codeError}
            <p class="help is-danger">{codeError.message}</p>
          {/if}
        </div>

        <div class="field">
          <label class="label">Título</label>
          <div class="control">
            <input
              class="input {titleError ? 'is-danger' : ''}"
              type="text"
              placeholder="Título"
              bind:value={selectedRule.title}
            />
          </div>
          {#if titleError}
            <p class="help is-danger">{titleError.message}</p>
          {/if}
        </div>

        <div class="field">
          <label class="label">Descrição</label>
          <div class="control">
            <Editor bind:text={selectedRule.text} />
          </div>
        </div>
      </div>
    {/if}

    <!-- AREA -->
    {#if selectedArea}
      {#if selectedArea.id}
        <h3 class="title">Editar Área</h3>
      {:else}
        <h3 class="title">Nova Área</h3>
      {/if}

      <div class="form">
        <div class="field">
          <label class="label">Nome</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="ex: Contas a Pagar"
              bind:value={selectedArea.name}
            />
          </div>
          <div class="field">
            <label class="label">Prefixo</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="REQ"
                bind:value={selectedArea.prefix}
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Número Inicial</label>
            <Nip bind:value={selectedArea.startNumber} />
          </div>
          <div class="field">
            <label class="label">Número Atual</label>
            <Nip bind:value={selectedArea.currentNumber} />
          </div>
        </div>
      </div>
      <div class="buttons">
        {#if selectedArea.id}
          <button class="button is-danger" on:click={removeArea}>Remover</button
          >
        {/if}
        <button class="button is-light" on:click={cancelArea}>Cancelar</button>
        <button class="button is-primary" on:click={saveArea}>Salvar</button>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .brules-menu {
    font-size: 1rem;
    display: block;
    line-height: 1.25;

    .lbl {
      color: #7a7a7a;
      font-size: 0.8em;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-weight: 400;
      line-height: 1.5;
      margin-top: 1em;
      font-weight: 600;
      // border-bottom: 1px solid #dbdbdb;
      &:hover {
        background-color: #f5f5f5;
        color: #363636;
        cursor: pointer;
      }
    }

    input {
      margin-bottom: 0.5em;
    }

    .add-area {
      margin-bottom: 0.5rem;
    }

    a.action,
    a.item {
      display: block;
      padding: 0.5em 0.75em;
      border-radius: 2px;
      cursor: pointer;
      text-decoration: none;
      color: rgb(74, 74, 74) !important;

      &:hover {
        background-color: #f5f5f5;
        color: #363636;
      }
      &.is-active {
        background-color: #3273dc;
        color: #ffff !important;
      }
      &.stronger {
        font-weight: 600;
      }
    }

    .items {
      border-left: 1px solid #dbdbdb;
      margin: 0.75em;
      padding-left: 0.75em;
    }
  }

  .form {
    padding: 1rem 0rem;
  }

  .noptop {
    padding-top: 0px !important;
  }
</style>
