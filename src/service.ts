import { Result } from './result';
import config from "./config";
import { canWrite, isAuthenticated, user } from "./store";
export class Service {

  api: string;
  canWrite: boolean;

  constructor() {
    this.api = config.server;

    const unsubscribe = canWrite.subscribe(value => {
      this.canWrite = value;
    });
  }

  getStatus() {
    return [
      { id: "Proposed", name: "Proposto" },
      { id: "Implemented", name: "Implementado" },
      { id: "Deprecated", name: "Descontinuado" },
      { id: "Removed", name: "Removido" },
    ];
  }


  async getAreas() {
    let request = await fetch(this.api + 'areas');
    let response = await request.json();
    return response;
  }

  async saveArea(area) {
    // if(!this.canWrite)
    // {
    //   return;
    // }

    if (!area || !area.name) {
      return;
    }

    let method = 'POST';
    if (area.id) {
      method = "PUT"
    }

    const res: Response = await fetch(this.api + 'areas', {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(area)
    })

    if (res.ok) {
      let data = await res.json();
      return Result.Ok(data);
    }
    else {
      return Result.Error("Error saving");
    }
  }

  async saveRule(rule) {
    // if(!this.canWrite)
    // {
    //   return;
    // }

    let validation = this.validateRule(rule);
    if (validation.isError) {
      return validation;
    }

    let res: Response;

    if (rule.id) {
      res = await fetch(this.api + 'rules', {
        method: 'PUT',
        body: JSON.stringify(rule),
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    }
    else {
      res = await fetch(this.api + 'rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rule)
      })
    }

    if (res.ok) {
      let data = await res.json();
      return Result.Ok(data);
    }
    else {
      //TODO add message
      return Result.Error("Error saving");
    }
  }

  validateRule(rule: IRule) {
    if (!rule) {
      return Result.Error("Invalid Rule");
    }

    let validation = new Result(true);
    if (!rule.code && rule.id) {
      validation.addValidation('code', 'Required');
    }

    if (!rule.areaId || rule.areaId === "") {
      validation.addValidation('areaId', 'Required');
    }

    if (!rule.title) {
      validation.addValidation('title', 'Required');
    }

    if (!rule.status) {
      validation.addValidation('status', 'Required');
    }

    return validation;

  }

}

export interface IRule {
  id?: string;
  code: string;
  title: string;
  text: string;
  areaId: string;
  status: string;
  tags: string[];

}

export interface IArea {
  id?: string;
  name: string;
  rules: IRule[];
}

