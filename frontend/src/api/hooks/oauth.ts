import { api } from "../api";

export function useOAuth() {
  async function google() {
    requestAuthentication("google");
  }

  async function github() {
    requestAuthentication("github");
  }

  async function requestAuthentication(provider: string) {
    const location = window.location.href;
    const state = encodeURIComponent(JSON.stringify({
      returnURL: location
    }));

    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/${provider}?state=${state}`;
  }


  return { google, github };
}