<?php
namespace App\Console\Commands;
use App\Http\Controllers\CronJobController;
use Illuminate\Console\Command;
class MontlyReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'monthly:reminder';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';
    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }
    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //
        $cron = new CronJobController();
        $cron->makePayment();
    }
}