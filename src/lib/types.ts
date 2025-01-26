import {HACK_SCRIPT_SIZE, GROW_SCRIPT_SIZE, WEAKEN_SCRIPT_SIZE} from "lib/constants"

export type Instant = number;

export class TimeRange {
  constructor(
    readonly start_time: Instant,
    readonly end_time: Instant,
  ) {}
}

export class HackResult {
  constructor(
    readonly batch_id: number,
    readonly profit: number,
  ) {}
}

export enum JobType {
  HACK,
  GROW,
  WEAKEN
}

export enum JobStatus {
  READY,
  RUNNING,
  COMPLETE
}

export class Job {
  readonly id: number
  public status: JobStatus;
  public job_pid: number | null;
  public job_host: string | null;

  constructor(
    readonly batch_id: number,
    readonly target: String,
    readonly job_type: JobType,
    readonly threads: number,
    readonly start_time: Instant,
  ) {
    this.id = Math.floor(Math.random() * 1000000)
    this.status = JobStatus.READY;
    this.job_pid = null;
    this.job_host = null;
  }

  script_name() {
    if (this.job_type == JobType.HACK) {
      return "hack.ts"
    }
    if (this.job_type == JobType.GROW) {
      return "grow.ts"
    }
    if (this.job_type == JobType.WEAKEN) {
      return "weaken.ts"
    }
    else {
      return "unknown-script.ts"
    }
  }

  script_path() {
    return `/bin/batch/${this.script_name()}`;
  }

  execute(ns: NS, host: string) {
    if (!ns.fileExists(this.script_name(), host)) {
      ns.scp(this.script_path(), host, "home")
    }

    // TODO: account for CPU cores if on the home server

    this.job_host = host;
    this.job_pid = ns.exec(this.script_name(), host, this.threads, `${this.target}`, this.batch_id);
    this.status = JobStatus.RUNNING;
  }

  should_execute() {
    return ((this.status == JobStatus.READY) && (Date.now() > this.start_time))
  }

  is_complete(ns: NS) {
    return this.status == JobStatus.COMPLETE || (this.job_pid != null && ns.isRunning(this.job_pid))
  }

  required_ram() {
    if (this.job_type == JobType.HACK) {
      return HACK_SCRIPT_SIZE * this.threads;
    }
    if (this.job_type == JobType.GROW) {
      return GROW_SCRIPT_SIZE * this.threads;
    }
    if (this.job_type == JobType.WEAKEN) {
      return WEAKEN_SCRIPT_SIZE * this.threads;
    }
    else {
      return 0
    }
  }
}
