import * as tl from 'vsts-task-lib/task';

export enum EndpointType {
  SonarCloud = 'SonarCloud',
  SonarQube = 'SonarQube'
}

export interface EndpointData {
  url: string;
  token?: string;
  username?: string;
  password?: string;
  organization?: string;
}

export default class Endpoint {
  constructor(public type: EndpointType, private readonly data: EndpointData) {}

  public get auth() {
    if (!this.data.token && this.data.password) {
      return { user: this.data.username, pass: this.data.password };
    }
    return { user: this.data.token || this.data.username };
  }

  public get organization() {
    return this.data.organization;
  }

  public get url() {
    return this.data.url;
  }

  public toJson() {
    return JSON.stringify({ type: this.type, data: this.data });
  }

  public static getEndpoint(id: string, type: EndpointType): Endpoint {
    const url = tl.getEndpointUrl(id, false);
    const token = tl.getEndpointAuthorizationParameter(
      id,
      'apitoken',
      type !== EndpointType.SonarCloud
    );
    const username = tl.getEndpointAuthorizationParameter(id, 'username', true);
    const password = tl.getEndpointAuthorizationParameter(id, 'password', true);
    const organization = tl.getInput('organization', type === EndpointType.SonarCloud);
    return new Endpoint(type, { url, token, username, password, organization });
  }
}