import { PlatformException } from './exceptions';
import { Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

export const requireInject = (inject: RequireInject, moduleRef?: ModuleRef) => {
  if (inject === RequireInjectEnum.CHIMERA_CONNECT) {
    return initiateChimeraConnector(moduleRef);
  }
};

const initiateChimeraConnector = (moduleRef: ModuleRef) => {
  try {
    if (
      process.env.NOVU_ENTERPRISE === 'true' ||
      process.env.CI_EE_TEST === 'true'
    ) {
      if (!require('@novu/ee-chimera-connect')?.ChimeraConnector) {
        throw new PlatformException('ChimeraConnector module is not loaded');
      }

      return moduleRef.get(
        require('@novu/ee-chimera-connect')?.ChimeraConnector,
        {
          strict: false,
        }
      );
    }
  } catch (e) {
    Logger.error(
      e,
      `Unexpected error while importing enterprise modules`,
      'ChimeraConnector'
    );
  }
};

type RequireInject = `${RequireInjectEnum}`;

enum RequireInjectEnum {
  CHIMERA_CONNECT = 'chimera_connector',
}

export interface IChimeraDigestResponse {
  amount: number;
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
  type: 'regular';
  backoff: boolean;
  digestKey: string;
}

export interface IChimeraDelayResponse {
  amount: number;
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
  type: 'regular';
}

export interface IChimeraInAppResponse {
  body: string;
}

export interface IChimeraChatResponse {
  body: string;
}

export interface IChimeraEmailResponse {
  subject: string;
  body: string;
}

export interface IChimeraPushResponse {
  subject: string;
  body: string;
}

export interface IChimeraSmsResponse {
  body: string;
}

export type IChimeraChannelResponse =
  | IChimeraInAppResponse
  | IChimeraChatResponse
  | IChimeraEmailResponse
  | IChimeraPushResponse
  | IChimeraSmsResponse;

export interface IUseCaseInterface<TInput, TResponse> {
  execute: (arg0: TInput) => TResponse;
}

export interface IUseCaseInterfaceInline {
  execute: <TInput, TResponse>(arg0: TInput) => Promise<TResponse>;
}