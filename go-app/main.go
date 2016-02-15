package main

import( 
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
	"database/sql"
	 _ "github.com/go-sql-driver/mysql"
)


func dbDelay (duration string) {

	con, err := sql.Open("mysql", "root:mypassword@tcp(db:3306)/mysql")
	
	if(err != nil) {
		log.Printf("Error:.... %v", err)
	} else {
		_, err = con.Exec("Select SLEEP("+duration+") ")

		if(err != nil) {
			log.Printf("Error:.... %v", err)
		}
		defer con.Close()		
	}
}

func getDuration (r *http.Request) string {
	
	duration := r.URL.Query().Get("duration");

	if duration == "" {
		duration = "5"
	}

	return duration
}

func home (w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Go Test")
}

func longDbQuery (w http.ResponseWriter, r *http.Request) {
	duration := getDuration(r)
	log.Printf("about execute a DB Query that will take %v seconds", duration)
	dbDelay(duration)
	log.Printf("DB Query took %v seconds", duration)
}

func sleep (w http.ResponseWriter, r *http.Request) {
	duration, _  := strconv.ParseInt(getDuration(r),0,64);
	log.Printf("about to sleep for %v seconds", duration)
	time.Sleep(time.Duration(duration) * time.Second)
	log.Printf("woke up after sleeping for %v seconds", duration)
	fmt.Fprintf(w, "Slept for %v seconds", duration)
}

func main() {

	for  _, m := range []struct{Path string; Handler func(w http.ResponseWriter, r *http.Request)} {
		{"/", home},
		{"/sleep", sleep},
		{"/longDbQuery", longDbQuery},
	} {
		http.HandleFunc(m.Path, m.Handler)
    }
    http.ListenAndServe(":8080", nil)
}